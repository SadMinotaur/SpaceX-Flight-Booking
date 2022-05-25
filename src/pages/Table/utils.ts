import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { CardsState, LaunchesState, LaunchType } from "@store/launches/launchesTypes";
import { isString } from "@utils/simpleTypeGuards";
import React from "react";

export const typographyStyles = { color: "text.primary", textTransform: "uppercase" } as const;
export const disabledColumns = new Set<string>(["past"]);

export type ModalState = {
  id: string;
  cardsState: CardsState;
};

const findContainer = (id: string, items: CardsState): string | undefined => {
  if (id in items) return id;
  return Object.keys(items).find((key) => items[key].find((item: LaunchType) => item.id === id));
};

interface HandleDragEndType {
  e: DragEndEvent;
  items: CardsState;
  setItems: React.Dispatch<React.SetStateAction<CardsState>>;
  bookLaunch: (arg: ModalState) => void;
  setModalState: React.Dispatch<React.SetStateAction<ModalState | null>>;
  itemsBeforeDrag: CardsState | null;
  setItemsBeforeDrag: React.Dispatch<React.SetStateAction<CardsState | null>>;
}
export const handleDragEnd = ({
  e: { active, over },
  items,
  setItems,
  bookLaunch,
  setModalState,
  itemsBeforeDrag,
  setItemsBeforeDrag
}: HandleDragEndType): void => {
  const activeContainer = findContainer(active.id.toString(), items);
  const overContainer = over?.id && findContainer(over.id.toString(), items);
  if (!activeContainer || !overContainer || activeContainer !== overContainer) return;
  const activeIndex: number = items[activeContainer].findIndex(
    (item: LaunchType) => item.id === active?.id
  );
  const overIndex: number = items[overContainer].findIndex(
    (item: LaunchType) => item.id === over?.id
  );
  if (itemsBeforeDrag) {
    const cardsState = {
      ...items,
      [overContainer]: arrayMove<LaunchType>(items[overContainer], activeIndex, overIndex)
    };
    if (cardsState.booked.length > itemsBeforeDrag.booked.length) {
      bookLaunch({ id: active.id.toString(), cardsState });
      setItemsBeforeDrag(null);
      return;
    }
    if (cardsState.upcoming.length > itemsBeforeDrag.upcoming.length) {
      setItems(itemsBeforeDrag);
      setModalState({ id: active.id.toString(), cardsState });
      setItemsBeforeDrag(null);
      return;
    }
    if (activeIndex !== overIndex) {
      setItems(cardsState);
    }
    setItemsBeforeDrag(null);
  }
};

interface HandleDragOverType {
  e: DragEndEvent;
  items: CardsState;
  setItems: React.Dispatch<React.SetStateAction<CardsState>>;
}
export const handleDragOver = ({
  e: { active, over },
  items,
  setItems
}: HandleDragOverType): void => {
  const id: string = isString(active.id) ? active.id : "";
  const overId: string = over?.id && isString(over.id) ? over.id : "";
  const activeContainer = findContainer(id, items);
  const overContainer = findContainer(overId, items);
  if (
    !activeContainer ||
    !overContainer ||
    activeContainer === overContainer ||
    disabledColumns.has(overContainer)
  )
    return;

  setItems((array) => {
    const activeItems: LaunchType[] = array[activeContainer];
    const overItems: LaunchType[] = array[overContainer];
    const activeIndex: number = activeItems.findIndex((item: LaunchType) => item.id === id);
    const overIndex: number = overItems.findIndex((item: LaunchType) => item.id === id);
    let newIndex: number;
    if (overId in array) {
      newIndex = overItems.length + 1;
    } else {
      newIndex = overIndex >= 0 ? overIndex : overItems.length + 1;
    }
    return {
      ...array,
      [activeContainer]: [
        ...array[activeContainer].filter((item: LaunchType) => item.id !== active.id)
      ],
      [overContainer]: [
        ...array[overContainer].slice(0, newIndex),
        array[activeContainer][activeIndex],
        ...array[overContainer].slice(newIndex, array[overContainer].length)
      ]
    };
  });
};

interface HandleDragStartType {
  e: DragStartEvent;
  items: CardsState;
  setActiveItem: React.Dispatch<React.SetStateAction<LaunchType | null>>;
  setItemsBeforeDrag: React.Dispatch<React.SetStateAction<CardsState | null>>;
}
export const handleDragStart = ({
  e,
  items,
  setActiveItem,
  setItemsBeforeDrag
}: HandleDragStartType): void => {
  const containerId: string | undefined = e.active.data.current?.sortable?.containerId;
  if (containerId) {
    const launchesArray: LaunchType[] = items[containerId];
    const active = launchesArray.find((item: LaunchType) => item.id === e.active.id);
    if (active) setActiveItem(active);
  }
  setItemsBeforeDrag(items);
};

export const showLoader = (
  group: string,
  loader: (keyof { [key: string]: LaunchesState })[]
): boolean => {
  return loader.includes(group);
};

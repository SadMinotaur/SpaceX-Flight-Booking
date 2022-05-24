import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { CardsState, LaunchType, LoaderTypes } from "@store/launches/launchesTypes";
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
}
export const handleDragEnd = ({
  e: { active, over },
  items,
  setItems
}: HandleDragEndType): void => {
  const activeContainer = findContainer(active?.id.toString(), items);
  const overContainer = findContainer(active?.id.toString(), items);
  if (!activeContainer || !overContainer || activeContainer !== overContainer) return;
  const activeIndex: number = items[activeContainer].findIndex(
    (item: LaunchType) => item.id === active?.id
  );
  const overIndex: number = items[overContainer].findIndex(
    (item: LaunchType) => item.id === over?.id
  );
  if (activeIndex !== overIndex) {
    setItems((stateItems) => ({
      ...stateItems,
      [overContainer]: arrayMove<LaunchType>(stateItems[overContainer], activeIndex, overIndex)
    }));
  }
};

interface HandleDragOverType {
  e: DragEndEvent;
  items: CardsState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState | null>>;
  bookLaunch: (arg: ModalState) => void;
}
export const handleDragOver = ({
  e: { active, over },
  items,
  setModalState,
  bookLaunch
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

  const stateAfterColumnChange = (): CardsState => {
    const activeItems: LaunchType[] = items[activeContainer];
    const overItems: LaunchType[] = items[overContainer];
    const activeIndex: number = activeItems.findIndex((item: LaunchType) => item.id === id);
    const overIndex: number = overItems.findIndex((item: LaunchType) => item.id === id);
    let newIndex: number;
    if (overId in items) {
      newIndex = overItems.length + 1;
    } else {
      newIndex = overIndex >= 0 ? overIndex : overItems.length + 1;
    }
    return {
      ...items,
      [activeContainer]: [
        ...items[activeContainer].filter((item: LaunchType) => item.id !== active.id)
      ],
      [overContainer]: [
        ...items[overContainer].slice(0, newIndex),
        items[activeContainer][activeIndex],
        ...items[overContainer].slice(newIndex, items[overContainer].length)
      ]
    };
  };

  const fakeReqPayload = { id, cardsState: stateAfterColumnChange() };
  if (overContainer === "upcoming") {
    setModalState(fakeReqPayload);
  } else {
    bookLaunch(fakeReqPayload);
  }
};

interface HandleDragStartType {
  e: DragStartEvent;
  items: CardsState;
  setActiveItem: React.Dispatch<React.SetStateAction<LaunchType | null>>;
}
export const handleDragStart = ({ e, items, setActiveItem }: HandleDragStartType): void => {
  const containerId: string | undefined = e.active.data.current?.sortable?.containerId;
  if (containerId) {
    const launchesArray: LaunchType[] = items[containerId];
    const active = launchesArray.find((item: LaunchType) => item.id === e.active.id);
    if (active) setActiveItem(active);
  }
};

export const showLoader = (group: string, loader: LoaderTypes): boolean => {
  if (loader === group || loader === "all") return true;
  return false;
};

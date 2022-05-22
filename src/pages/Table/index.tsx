import Column from "@components/column";
import TableCard from "@components/table-card";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Typography } from "@mui/material";
import { getLaunchesActionRequest } from "@store/launches/launchesActions";
import { LaunchType } from "@store/launches/launchesTypes";
import { RootState } from "@store/store";
import { isString } from "@utils/simpleTypeGuards";
import classNames from "classnames/bind";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.scss";

const cnb = classNames.bind(styles);

const typoStyles = { color: "text.primary", textTransform: "uppercase" } as const;

type MapType = Map<string, LaunchType>;

export default function Table(): React.ReactElement {
  const dispatch = useDispatch();
  const launches = useSelector((state: RootState) => state.launches);

  const [items, setItems] = React.useState<{
    past: MapType;
    upcoming: MapType;
    booked: MapType;
  }>({
    past: new Map([]),
    upcoming: new Map([]),
    booked: new Map([])
  });

  const [activeId, setActiveId] = React.useState<number | string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const findContainer = (id: string): string | undefined => {
    if (id in items) return id;
    return Object.keys(items).find((key) => items[key].get(id));
  };

  const handleDragStart = (event: DragStartEvent): void => {
    setActiveId(event.active.id);
  };

  const handleDragOver = ({ active, over }: DragOverEvent): void => {
    const id: string = isString(active.id) ? active.id : "";
    const overId: string = over?.id && isString(over.id) ? over.id : "";
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setItems((prev) => {
      const activeItems: MapType = prev[activeContainer];
      const overItems: MapType = prev[overContainer];
      const activeMapArray: [string, LaunchType][] = Array.from(activeItems);
      const overItemsMapArray: [string, LaunchType][] = Array.from(overItems);
      const activeIndex = activeItems.get(id)?.id;
      const overIndex = overItemsMapArray.findIndex((item) => item[0] === overId);

      let newIndex: number;
      if (overId in prev) {
        newIndex = overItems.size + 1;
      } else {
        newIndex = overIndex >= 0 ? overIndex : overItems.size + 1;
      }

      const activeIndexItem = activeIndex ? activeItems.get(activeIndex) : undefined;

      return {
        ...prev,
        [activeContainer]: new Map(activeMapArray.filter(([key]) => key !== active?.id)),
        [overContainer]: new Map([
          ...overItemsMapArray.slice(0, newIndex),
          [activeIndexItem?.id, activeIndexItem],
          ...overItemsMapArray.slice(newIndex, overItemsMapArray.length)
        ])
      };
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent): void => {
    const activeContainer = findContainer(active?.id.toString());
    const overContainer = findContainer(active?.id.toString());
    if (!activeContainer || !overContainer || activeContainer !== overContainer) return;
    const activeIndex: number = Array.from(items[activeContainer].keys()).findIndex(
      (item) => item === active?.id
    );
    const overIndex: number = Array.from(items[overContainer].keys()).findIndex(
      (item) => item === over?.id
    );
    if (activeIndex !== overIndex) {
      setItems((stateItems) => ({
        ...stateItems,
        [overContainer]: new Map(
          arrayMove<LaunchType>(
            Array.from(stateItems[overContainer].values()),
            activeIndex,
            overIndex
          ).map((item) => [item.id, item])
        )
      }));
    }
    setActiveId(null);
  };

  React.useEffect(() => {
    setItems({
      past: new Map(launches.past.slice(0, 5).map((item) => [item.id, item])),
      upcoming: new Map(launches.upcoming.slice(0, 5).map((item) => [item.id, item])),
      booked: new Map(launches.booked.slice(0, 5).map((item) => [item.id, item]))
    });
  }, [launches.booked, launches.past, launches.upcoming]);

  React.useEffect(() => {
    dispatch(getLaunchesActionRequest());
  }, [dispatch]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={cnb("tableContainer")}>
        <div className={cnb("columnHeader")}>
          <Typography variant='h5' sx={typoStyles}>
            Past launches
          </Typography>
        </div>
        <div className={cnb("columnHeader")}>
          <Typography variant='h5' sx={typoStyles}>
            Launches
          </Typography>
        </div>
        <div className={cnb("columnHeader")}>
          <Typography variant='h5' sx={typoStyles}>
            My launches
          </Typography>
        </div>
        {Object.keys(items).map((group) => (
          <Column
            id={group}
            items={Array.from(items[group].values())}
            key={group}
            showSkeletons={launches.loader}
          />
        ))}
      </div>
      <DragOverlay>{activeId ? <TableCard id={activeId.toString()} /> : null}</DragOverlay>
    </DndContext>
  );
}

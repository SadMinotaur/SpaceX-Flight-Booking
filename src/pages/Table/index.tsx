import Column from "@components/column";
import TableCard from "@components/table-card";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
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
import classNames from "classnames/bind";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.scss";

const cnb = classNames.bind(styles);

const typoStyles = { color: "text.primary", textTransform: "uppercase" } as const;

export default function Table(): React.ReactElement {
  const dispatch = useDispatch();
  const launches = useSelector((state: RootState) => state.launches);

  const [items, setItems] = React.useState<{
    past: LaunchType[];
    upcoming: LaunchType[];
    booked: LaunchType[];
  }>({
    past: [],
    upcoming: [],
    booked: []
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
    return Object.keys(items).find((key) => items[key].find((item) => id === item.id));
  };

  const handleDragStart = (event: DragStartEvent): void => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event): void => {
    const { active, over, draggingRect } = event;
    const { id } = active;
    const { id: overId } = over;
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;
    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.find((item) => item.id === id)?.id;
      const overIndex = overItems.find((item) => item.id === overId)?.id;
      let newIndex;
      if (overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          draggingRect?.offsetTop > over.rect.offsetTop + over.rect.height;
        const modifier = isBelowLastItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }
      return {
        ...prev,
        [activeContainer]: [...prev[activeContainer].filter((item) => item.id !== active.id)],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer].find((item) => item.id === activeIndex),
          ...prev[overContainer].slice(newIndex, prev[overContainer].length)
        ]
      };
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent): void => {
    const activeContainer = findContainer(active?.id.toString());
    const overContainer = findContainer(active?.id.toString());
    if (!activeContainer || !overContainer || activeContainer !== overContainer) return;
    const activeIndex = items[activeContainer].findIndex((item) => item.id === active?.id);
    const overIndex = items[overContainer].findIndex((item) => item.id === over?.id);
    if (activeIndex !== overIndex) {
      setItems((stateItems) => ({
        ...stateItems,
        [overContainer]: arrayMove(stateItems[overContainer], activeIndex, overIndex)
      }));
    }
    setActiveId(null);
  };

  React.useEffect(() => {
    setItems({
      past: launches.past.slice(0, 5),
      upcoming: launches.upcoming.slice(0, 5),
      booked: launches.booked.slice(0, 5)
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
          <Column id={group} items={items[group]} key={group} showSkeletons={launches.loader} />
        ))}
      </div>
      <DragOverlay>{activeId ? <TableCard id={activeId.toString()} /> : null}</DragOverlay>
    </DndContext>
  );
}

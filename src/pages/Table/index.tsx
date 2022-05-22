import TableCard from "@components/card";
import Column from "@components/column";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Typography } from "@mui/material";
import { getLaunchesActionRequest } from "@store/launches/launchesActions";
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

  const [items, setItems] = React.useState({
    container1: ["1", "2", "3"],
    container2: ["4", "5", "6"]
    // container3: ["7", "8", "9"]
  });
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  function findContainer(id: string) {
    if (id in items) {
      return id;
    }
    return Object.keys(items).find((key) => items[key].includes(id));
  }

  function handleDragStart(event): void {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  }

  function handleDragOver(event): void {
    const { active, over, draggingRect } = event;
    const { id } = active;
    const { id: overId } = over;
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;
    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.indexOf(id);
      const overIndex = overItems.indexOf(overId);
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
        [activeContainer]: [...prev[activeContainer].filter((item) => item !== active.id)],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length)
        ]
      };
    });
  }

  function handleDragEnd(event): void {
    const { active, over } = event;
    const activeContainer = findContainer(active?.id);
    const overContainer = findContainer(over?.id);
    if (!activeContainer || !overContainer || activeContainer !== overContainer) return;
    const activeIndex = items[activeContainer].indexOf(active?.id);
    const overIndex = items[overContainer].indexOf(over?.id);
    if (activeIndex !== overIndex) {
      setItems((staetItems) => ({
        ...staetItems,
        [overContainer]: arrayMove(staetItems[overContainer], activeIndex, overIndex)
      }));
    }
    setActiveId(null);
  }

  React.useEffect(() => {
    dispatch(getLaunchesActionRequest());
    return () => {};
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
        {/* {Object.keys(items).map((group) => (
          <Column id={group} items={items[group]} key={group} />
        ))} */}
        <Column id='test' items={launches.upcoming} key='test' showSkeletons={launches.loader} />
      </div>
      <DragOverlay>{activeId ? <TableCard id={activeId} /> : null}</DragOverlay>
    </DndContext>
  );
}

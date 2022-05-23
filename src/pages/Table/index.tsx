import Column from "@components/column";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Snackbar, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { getLaunchesActionRequest } from "@store/launches/launchesActions";
import { CardsState, LaunchType, MapArrayType, MapType } from "@store/launches/launchesTypes";
import { RootState } from "@store/store";
import { isString } from "@utils/simpleTypeGuards";
import classNames from "classnames/bind";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.scss";

const cnb = classNames.bind(styles);

const typoStyles = { color: "text.primary", textTransform: "uppercase" } as const;
const disabledColumns = new Set<string>(["past"]);

export default function Table(): React.ReactElement {
  const dispatch = useDispatch();
  const launches = useSelector((state: RootState) => state.launches);

  const [items, setItems] = React.useState<CardsState>({
    past: new Map([]),
    upcoming: new Map([]),
    booked: new Map([])
  });

  const [snackbarState, setSnackbarState] = React.useState<boolean>(false);
  const [modalState, setModalState] = React.useState<boolean>(false);

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

  const handleDragOver = ({ active, over }: DragOverEvent): void => {
    const id: string = isString(active.id) ? active.id : "";
    const overId: string = over?.id && isString(over.id) ? over.id : "";
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer ||
      disabledColumns.has(overContainer)
    )
      return;

    const func = () =>
      setItems((prev) => {
        const activeItems: MapType = prev[activeContainer];
        const overItems: MapType = prev[overContainer];
        const activeMapArray: MapArrayType = Array.from(activeItems);
        const overItemsMapArray: MapArrayType = Array.from(overItems);
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

    if (overContainer === "upcoming") {
      setModalState(true);
      func();
    } else {
      setSnackbarState(true);
      func();
    }
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
  };

  const closeModal = () => {
    setModalState(false);
  };

  const closeSnackbar = () => {
    setSnackbarState(false);
  };

  const agreeClick = () => {
    closeModal();
  };

  React.useEffect(() => {
    setItems({
      past: new Map(launches.past.slice(0, 5).map((item) => [item.id, item])),
      upcoming: new Map(launches.upcoming.map((item) => [item.id, item])),
      booked: new Map(launches.booked.map((item) => [item.id, item]))
    });
  }, [launches.booked, launches.past, launches.upcoming]);

  React.useEffect(() => {
    dispatch(getLaunchesActionRequest());
  }, [dispatch]);

  return (
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {Object.keys(items).map((group) => (
          <Column
            id={group}
            key={group}
            items={Array.from(items[group].values())}
            showSkeletons={launches.loader}
            disabled={disabledColumns.has(group)}
          />
        ))}
      </DndContext>
      <Dialog open={modalState} onClose={closeModal}>
        <DialogTitle>Cancel this launch?</DialogTitle>
        <DialogActions>
          <Button onClick={agreeClick} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarState} onClick={closeSnackbar} message='Launch booked' />
    </div>
  );
}

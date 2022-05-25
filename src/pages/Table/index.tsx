import Column from "@components/column";
import TableCard from "@components/table-card";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Snackbar, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import {
  bookLaunchesActionRequest,
  getLaunchesActionRequest
} from "@store/launches/launchesActions";
import { CardsState, LaunchesBookTypes, LaunchType } from "@store/launches/launchesTypes";
import { RootState } from "@store/store";
import classNames from "classnames/bind";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.scss";
import {
  disabledColumns,
  handleDragEnd,
  handleDragOver,
  handleDragStart,
  ModalState,
  showLoader,
  typographyStyles
} from "./utils";

const cnb = classNames.bind(styles);

export default function Table(): React.ReactElement {
  const dispatch = useDispatch();
  const launches = useSelector((state: RootState) => state.launches);

  const [items, setItems] = React.useState<CardsState>({
    past: [],
    upcoming: [],
    booked: []
  });

  const [snackbarState, setSnackbarState] = React.useState<boolean>(false);
  const [modalState, setModalState] = React.useState<ModalState | null>(null);
  const [activeItem, setActiveItem] = React.useState<LaunchType | null>(null);
  const [itemsBeforeDrag, setItemsBeforeDrag] = React.useState<CardsState | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const closeModal = (): void => {
    setModalState(null);
  };

  const onAgreeClick = (): void => {
    if (modalState)
      dispatch(
        bookLaunchesActionRequest({
          type: LaunchesBookTypes.cancel,
          id: modalState.id,
          cardsState: modalState.cardsState
        })
      );
    closeModal();
  };

  const bookLaunch = ({ cardsState, id }: ModalState): void => {
    dispatch(
      bookLaunchesActionRequest({
        type: LaunchesBookTypes.book,
        id,
        cardsState,
        callBack: () => setSnackbarState(true)
      })
    );
  };

  const closeSnackbar = (): void => {
    setSnackbarState(false);
  };

  React.useEffect(() => {
    setItems({
      past: launches.past,
      upcoming: launches.upcoming,
      booked: launches.booked
    });
  }, [launches.booked, launches.past, launches.upcoming]);

  React.useEffect(() => {
    dispatch(getLaunchesActionRequest());
  }, [dispatch]);

  return (
    <div className={cnb("tableContainer")}>
      <div className={cnb("columnHeader")}>
        <Typography variant='h5' sx={typographyStyles}>
          Past launches
        </Typography>
      </div>
      <div className={cnb("columnHeader")}>
        <Typography variant='h5' sx={typographyStyles}>
          Launches
        </Typography>
      </div>
      <div className={cnb("columnHeader")}>
        <Typography variant='h5' sx={typographyStyles}>
          My launches
        </Typography>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(e) => handleDragStart({ e, items, setActiveItem, setItemsBeforeDrag })}
        onDragOver={(e) => handleDragOver({ e, items, setItems })}
        onDragEnd={(e) =>
          handleDragEnd({
            e,
            items,
            setItems,
            bookLaunch,
            setModalState,
            itemsBeforeDrag,
            setItemsBeforeDrag
          })
        }
      >
        {Object.keys(items).map((group: string) => (
          <Column
            id={group}
            key={`columns${group}`}
            items={items[group]}
            showSkeletons={showLoader(group, launches.loader)}
            disabled={disabledColumns.has(group)}
          />
        ))}
        <DragOverlay>
          {activeItem && <TableCard id={activeItem.id} cardInfo={activeItem} />}
        </DragOverlay>
      </DndContext>
      <Dialog open={!!modalState} onClose={closeModal}>
        <DialogTitle>Cancel this launch?</DialogTitle>
        <DialogActions>
          <Button onClick={onAgreeClick} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!snackbarState}
        onClose={closeSnackbar}
        message='Launch booked'
        autoHideDuration={2000}
      />
    </div>
  );
}

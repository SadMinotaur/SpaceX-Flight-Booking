import TableCard from "@components/table-card";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { Box } from "@mui/material";
import { LaunchType } from "@store/launches/launchesTypes";
import React from "react";
import styles from "./styles.module.scss";

interface Props {
  id: string;
  items: LaunchType[];
  showSkeletons?: boolean;
  disabled?: boolean;
}

export default function Column({ items, id, showSkeletons, disabled }: Props): React.ReactElement {
  const { setNodeRef } = useDroppable({ id, disabled });

  return (
    <SortableContext id={id} items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
      <Box
        ref={setNodeRef}
        className={styles.box}
        sx={{
          border: "1px solid",
          borderColor: "text.primary"
        }}
      >
        {showSkeletons
          ? [...Array(3)].map(() => {
              const key = `skeleton${Math.random()}`;
              return <TableCard key={key} id={key} disableDrag />;
            })
          : items.map((item) => <TableCard key={item.id} id={item.id} cardInfo={item} />)}
      </Box>
    </SortableContext>
  );
}

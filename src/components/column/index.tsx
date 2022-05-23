import TableCard from "@components/table-card";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
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

const stylesBox = {
  border: "1px solid",
  borderColor: "text.primary"
} as const;

export default function Column({
  items,
  id,
  showSkeletons,
  disabled
}: Readonly<Props>): React.ReactElement {
  const { setNodeRef } = useDroppable({ id, disabled });

  return (
    <SortableContext
      id={id}
      items={items.map((item) => item.id)}
      strategy={verticalListSortingStrategy}
      disabled={disabled}
    >
      <Box className={styles.box} sx={stylesBox} ref={setNodeRef}>
        {showSkeletons
          ? [...Array(3)].map(() => {
              const key = `skeleton${Math.random()}`;
              return <TableCard key={key} id={key} disableDrag />;
            })
          : items.map((item) => (
              <TableCard disableDrag={disabled} key={item.id} id={item.id} cardInfo={item} />
            ))}
      </Box>
    </SortableContext>
  );
}

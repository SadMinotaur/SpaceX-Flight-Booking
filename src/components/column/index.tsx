import TableCard from "@components/card";
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
    <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
      <Box
        ref={setNodeRef}
        sx={{
          border: "1px solid",
          borderColor: "text.primary"
        }}
        className={styles.box}
      >
        {showSkeletons &&
          [...Array(3)].map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <TableCard key={`skeleton${i}`} id={i.toString()} disableDrag />
          ))}
        {items.map((item) => (
          <TableCard key={item.id} id={item.id} cardInfo={item} />
        ))}
      </Box>
    </SortableContext>
  );
}

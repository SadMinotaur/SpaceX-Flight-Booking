import TableCard from "@components/card";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { Box } from "@mui/material";
import React from "react";
import styles from "./styles.module.scss";

interface Props {
  id: string;
  items: string[];
  disabled?: boolean;
}

export default function Column({ items, id, disabled }: Props): React.ReactElement {
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
        {items.map((item) => (
          <TableCard key={item} id={item} />
        ))}
      </Box>
    </SortableContext>
  );
}

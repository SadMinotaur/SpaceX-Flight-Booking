import TableCard from "@components/table-card";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box } from "@mui/material";
import { LaunchType } from "@store/launches/launchesTypes";
import classNames from "classnames/bind";
import React from "react";
import { useVirtual } from "react-virtual";
import styles from "./styles.module.scss";

const cnb = classNames.bind(styles);

interface Props {
  id: string;
  items: LaunchType[];
  showSkeletons?: boolean;
  disabled?: boolean;
}

const stylesBox: React.CSSProperties = {
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
  const parentRef = React.useRef(null);

  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef,
    estimateSize: React.useCallback(() => 315, []),
    overscan: 2
  });

  return (
    <SortableContext
      id={id}
      items={items.map((item) => item.id)}
      strategy={verticalListSortingStrategy}
      disabled={disabled}
    >
      <Box className={styles.box} sx={stylesBox} ref={setNodeRef}>
        {showSkeletons &&
          [...Array(2)].map(() => {
            const key = `skeleton${Math.random()}`;
            return <TableCard key={key} id={key} />;
          })}
        {!showSkeletons && (
          <div ref={parentRef} className={cnb("listParentContainer")}>
            <div
              style={{
                height: `${rowVirtualizer.totalSize}px`,
                width: "100%",
                position: "relative"
              }}
            >
              {rowVirtualizer.virtualItems.map((virtualRow) => {
                const item: LaunchType = items[virtualRow.index];
                return (
                  <TableCard
                    key={item.id}
                    id={item.id}
                    cardInfo={item}
                    style={{
                      position: "absolute",
                      top: virtualRow.start
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </Box>
    </SortableContext>
  );
}

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, CardMedia, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { LaunchType } from "@store/launches/launchesTypes";
import classNames from "classnames/bind";
import React from "react";
import MemoizedSkeleton from "./MemoizedSkeleton";
import styles from "./styles.module.scss";

const cnb = classNames.bind(styles);

interface Props {
  id: string;
  cardInfo?: LaunchType;
  disableDrag?: boolean;
  style?: React.CSSProperties;
}

const convertDate = (date_utc?: string): string => {
  if (!date_utc) return "";
  return new Date(date_utc).toLocaleDateString("en", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
};

export default function TableCard({
  id,
  cardInfo,
  disableDrag,
  style
}: Readonly<Props>): React.ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    disabled: disableDrag
  });
  const showSkeleton = !cardInfo;

  return (
    <Card
      variant='outlined'
      className={cnb("cardWrapper")}
      sx={{
        ...style,
        transform: CSS.Transform.toString(transform),
        transition
      }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {showSkeleton ? (
        <MemoizedSkeleton />
      ) : (
        <>
          <CardMedia
            component='img'
            height='140'
            image={cardInfo.links.patch.small || "https://via.placeholder.com/350x140"}
            alt={`${cardInfo?.name} flight patch`}
          />
          <CardContent>
            <Typography variant='h4'>{cardInfo?.name}</Typography>
            <Typography variant='h6'>Date: {convertDate(cardInfo.date_utc)}</Typography>
          </CardContent>
          <CardActions className={cnb("alignRight")}>
            <Button color='secondary'>Open</Button>
          </CardActions>
        </>
      )}
    </Card>
  );
}

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, CardMedia, Skeleton, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { LaunchType } from "@store/launches/launchesTypes";
import classNames from "classnames/bind";
import React from "react";
import styles from "./styles.module.scss";

const cnb = classNames.bind(styles);

interface Props {
  id: string;
  cardInfo?: LaunchType;
  disableDrag?: boolean;
  style?: React.CSSProperties;
}

export default function TableCard({ id, cardInfo, disableDrag, style }: Props): React.ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    disabled: disableDrag
  });

  const showSkeleton = !!cardInfo;
  const convertDate = (): string => {
    if (!cardInfo) return "";
    return new Date(cardInfo.date_utc).toLocaleDateString("en", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

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
        <CardMedia
          component='img'
          height='140'
          image={cardInfo.links.patch.small || "https://via.placeholder.com/140x370"}
          alt='flight patch'
        />
      ) : (
        <Skeleton variant='rectangular' width='100%' height={140} />
      )}
      <CardContent>
        {showSkeleton ? (
          <Typography variant='h4'>{cardInfo?.name}</Typography>
        ) : (
          <Skeleton variant='text' height={40} />
        )}
        {showSkeleton ? (
          <Typography variant='h6'>Date: {convertDate()}</Typography>
        ) : (
          <Skeleton variant='text' height={32} />
        )}
      </CardContent>
      <CardActions className={cnb("alignRight")}>
        {showSkeleton ? (
          <Button color='secondary'>Open</Button>
        ) : (
          <Skeleton variant='rectangular' width={62} height={32} />
        )}
      </CardActions>
    </Card>
  );
}

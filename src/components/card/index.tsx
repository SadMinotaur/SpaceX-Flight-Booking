import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import classNames from "classnames/bind";
import React from "react";
import styles from "./styles.module.scss";

const cnb = classNames.bind(styles);

interface Props {
  id: string;
}

export default function TableCard({ id }: Props): React.ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id
  });

  return (
    <Card
      variant='outlined'
      className={cnb("cardWrapper")}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          Word of the Day
        </Typography>
        <Typography variant='h5' component='div'>
          be
        </Typography>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          adjective
        </Typography>
        <Typography variant='body2'>well meaning and kindly.</Typography>
      </CardContent>
      <CardActions>
        <Button size='small'>Learn More</Button>
      </CardActions>
    </Card>
  );
}

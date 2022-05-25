import { Skeleton } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import classNames from "classnames/bind";
import React from "react";
import styles from "./styles.module.scss";

const cnb = classNames.bind(styles);

function CardSkeleton(): React.ReactElement {
  return (
    <>
      <div>
        <Skeleton variant='rectangular' width='100%' height={140} />
        <CardContent>
          <Skeleton variant='text' height={40} />
          <Skeleton variant='text' height={32} />
        </CardContent>
      </div>
      <CardActions className={cnb("alignRight")}>
        <Skeleton variant='rectangular' width={62} height={32} />
      </CardActions>
    </>
  );
}

export default React.memo(CardSkeleton);

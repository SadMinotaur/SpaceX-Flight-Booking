import CircularProgress from "@mui/material/CircularProgress";
import classNames from "classnames/bind";
import React from "react";
import styles from "./styles.module.scss";

const cnb = classNames.bind(styles);

export default function Suspense(): React.ReactElement {
  return (
    <div className={cnb("fillSpace")}>
      <CircularProgress />
    </div>
  );
}

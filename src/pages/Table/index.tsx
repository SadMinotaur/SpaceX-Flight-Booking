import classNames from "classnames/bind";
import React from "react";
import styles from "./styles.module.scss";

const cnb = classNames.bind(styles);

export default function Table(): React.ReactElement {
  return <div className={styles.tableContainer}>test</div>;
}

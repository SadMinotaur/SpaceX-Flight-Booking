import { Typography } from "@mui/material";
import React from "react";
import styles from "./styles.module.scss";

export default function Header(): React.ReactElement {
  return (
    <header className={styles.headerContainer}>
      <Typography variant='h3'>Explore the space</Typography>
    </header>
  );
}

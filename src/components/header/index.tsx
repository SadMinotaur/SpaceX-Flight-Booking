import Brightness5Icon from "@mui/icons-material/Brightness5";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import HomeIcon from "@mui/icons-material/Home";
import { Button, Typography } from "@mui/material";
import { RootState } from "@store/store";
import { AppThemes, setAppTheme } from "@store/theme";
import classNames from "classnames/bind";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styles from "./styles.module.scss";

const cnb = classNames.bind(styles);

export default function Header(): React.ReactElement {
  const location = useLocation();
  const outsideHome = location.pathname !== "/";

  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);

  const onThemeSwitch = () => {
    dispatch(setAppTheme(theme === AppThemes.light ? AppThemes.dark : AppThemes.light));
  };

  return (
    <header className={cnb("headerContainer")}>
      <Typography variant='h3' sx={{ color: "text.primary" }}>
        Explore the space
      </Typography>
      <Button onClick={onThemeSwitch}>
        {theme === AppThemes.dark ? (
          <Brightness5Icon fontSize='large' sx={{ color: "text.primary" }} />
        ) : (
          <Brightness7Icon fontSize='large' sx={{ color: "text.primary" }} />
        )}
      </Button>
      {outsideHome && (
        <Button>
          <HomeIcon fontSize='large' sx={{ color: "text.primary" }} />
        </Button>
      )}
    </header>
  );
}

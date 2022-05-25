import Brightness5Icon from "@mui/icons-material/Brightness5";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import HomeIcon from "@mui/icons-material/Home";
import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { RootState } from "@store/store";
import { AppThemes, setAppTheme } from "@store/theme";
import classNames from "classnames/bind";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

const cnb = classNames.bind(styles);

const iconColor = { color: "text.primary" } as const;

export default function Header(): React.ReactElement {
  const location = useLocation();
  const outsideHome = location.pathname !== "/";

  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);
  const navigate = useNavigate();

  const onEnterClick = (): void => {
    navigate("/");
  };

  const onThemeSwitch = () => {
    dispatch(setAppTheme(theme === AppThemes.light ? AppThemes.dark : AppThemes.light));
  };

  return (
    <header className={cnb("headerContainer")}>
      <Typography variant='h3' sx={iconColor}>
        Explore the space
      </Typography>
      <IconButton onClick={onThemeSwitch}>
        {theme === AppThemes.dark ? (
          <Brightness5Icon fontSize='large' sx={iconColor} />
        ) : (
          <Brightness7Icon fontSize='large' sx={iconColor} />
        )}
      </IconButton>
      {outsideHome && (
        <IconButton onClick={onEnterClick}>
          <HomeIcon fontSize='large' sx={iconColor} />
        </IconButton>
      )}
    </header>
  );
}

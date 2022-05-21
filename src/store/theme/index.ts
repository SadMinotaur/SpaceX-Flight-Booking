import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum AppThemes {
  light = "light",
  dark = "dark"
}

const initialState = AppThemes.light;

const theme = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setAppTheme(_, action: PayloadAction<AppThemes>) {
      return action.payload;
    }
  }
});

export const { setAppTheme } = theme.actions;
export default theme.reducer;

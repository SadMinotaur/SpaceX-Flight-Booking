import { Box, createTheme, ThemeProvider } from "@mui/material";
import { RootState } from "@store/store";
import React from "react";
import { useSelector } from "react-redux";
import MainRouter from "./routing/Routes";

function App(): React.ReactElement {
  const mode = useSelector((state: RootState) => state.theme);
  const theme = createTheme({ palette: { mode } });

  return (
    <ThemeProvider theme={theme}>
      <Box
        className='boxStyle'
        sx={{
          bgcolor: "background.default"
        }}
      >
        <MainRouter />
      </Box>
    </ThemeProvider>
  );
}

export default App;

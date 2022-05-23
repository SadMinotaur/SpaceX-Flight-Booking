import Suspense from "@components/suspense";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import { persistor, RootState } from "@store/store";
import React from "react";
import { useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import MainRouter from "./routing/Routes";

function App(): React.ReactElement {
  const mode = useSelector((state: RootState) => state.theme);
  const theme = createTheme({ palette: { mode } });
  return (
    <PersistGate loading={<Suspense />} persistor={persistor}>
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
    </PersistGate>
  );
}

export default App;

import { createTheme, ThemeProvider } from "@mui/material";
import { store } from "@store/store";
import React from "react";
import { Provider } from "react-redux";
import MainRouter from "./routing/Routes";

function App(): React.ReactElement {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider
          theme={createTheme({
            palette: {}
          })}
        >
          <MainRouter />
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
}

export default App;

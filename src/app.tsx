import { store } from "@store/store";
import React from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import MainRouter from "./routing/Routes";

function App(): React.ReactElement {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <HashRouter basename={process.env.PUBLIC_URL}>
          <MainRouter />
        </HashRouter>
      </Provider>
    </React.StrictMode>
  );
}

export default App;

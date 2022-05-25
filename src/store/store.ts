import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware, { SagaMiddleware } from "redux-saga";
import launches from "./launches/lanchesRedusers";
import rootSaga from "./rootSaga";
import theme from "./theme";

const isDevelopment = process.env.NODE_ENV !== "production";

const reducer = combineReducers({
  theme,
  launches
});
const persistedReducer = persistReducer(
  {
    key: "root",
    whitelist: ["theme"],
    storage
  },
  reducer
);
export type RootState = ReturnType<typeof reducer>;

const sagaMiddleware: SagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [sagaMiddleware],
  devTools: isDevelopment
});
export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

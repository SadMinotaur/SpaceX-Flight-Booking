import { combineReducers, configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware, { SagaMiddleware } from "redux-saga";
import rootSaga from "./rootSaga";
import user from "./user/userRedusers";

const isDevelopment = process.env.NODE_ENV !== "production";

const reducer = combineReducers({
  user
});

export type RootState = ReturnType<typeof reducer>;
const sagaMiddleware: SagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer,
  middleware: [sagaMiddleware],
  devTools: isDevelopment
});
sagaMiddleware.run(rootSaga);

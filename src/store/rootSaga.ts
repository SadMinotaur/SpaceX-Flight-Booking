import { all } from "redux-saga/effects";
import watchOnUserChange from "./user/userSagas";

export default function* rootSaga(): Generator {
  yield all([watchOnUserChange()]);
}

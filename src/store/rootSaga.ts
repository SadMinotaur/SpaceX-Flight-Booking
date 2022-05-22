import { all } from "redux-saga/effects";
import watchOnLaunchesChange from "./launches/launchesSagas";

export default function* rootSaga(): Generator {
  yield all([watchOnLaunchesChange()]);
}

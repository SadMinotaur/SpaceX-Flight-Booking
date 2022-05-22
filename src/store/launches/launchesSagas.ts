import { getLaunchesRequest } from "@utils/api/requests";
import { LaunchesTypes } from "@utils/api/requestTypes";
import { call, put, takeLatest } from "redux-saga/effects";
import * as A from "./launchesActions";

function* getUpcomingLaunches() {
  try {
    yield put(A.setLoaderLaunches(true));
    const past = yield call(getLaunchesRequest, LaunchesTypes.past);
    const upcoming = yield call(getLaunchesRequest, LaunchesTypes.upcoming);
    yield put(A.getLaunchesActionSuccess({ past, upcoming }));
  } catch (e) {
    if (e instanceof Error) yield put(A.getLaunchesActionFailure(e.message));
  } finally {
    yield put(A.setLoaderLaunches(false));
  }
}

export default function* watchOnLaunchesChange(): Generator {
  yield takeLatest(A.getLaunchesActionRequest, getUpcomingLaunches);
}

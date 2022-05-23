import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import * as R from "@utils/api/requests";
import * as A from "./launchesActions";
import * as T from "./launchesTypes";

function* getLaunches() {
  try {
    yield put(A.setLoaderLaunches(true));
    const past = yield call(R.getLaunchesRequest, T.LaunchesGetTypes.past);
    const upcoming = yield call(R.getLaunchesRequest, T.LaunchesGetTypes.upcoming);
    yield put(A.setLaunches({ past, upcoming, booked: [] }));
  } catch (e) {
    if (e instanceof Error) yield put(A.getLaunchesActionFailure(e.message));
  } finally {
    yield put(A.setLoaderLaunches(false));
  }
}

function* bookLaunch({ payload }: PayloadAction<T.BookRequest>) {
  try {
    const { id, type, cardsState } = payload;
    yield put(A.setLoaderLaunches(true));
    yield call(R.bookLaunchRequest, { id, type });
    yield put(
      A.setLaunches({
        past: Array.from(cardsState.past.values()),
        upcoming: Array.from(cardsState.upcoming.values()),
        booked: Array.from(cardsState.booked.values())
      })
    );
  } catch (e) {
    if (e instanceof Error) yield put(A.bookLaunchesActionFailure(e.message));
  } finally {
    yield put(A.setLoaderLaunches(false));
  }
}

export default function* watchOnLaunchesChange(): Generator {
  yield takeLatest(A.getLaunchesActionRequest, getLaunches);
  yield takeLatest(A.bookLaunchesActionRequest, bookLaunch);
}

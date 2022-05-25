import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLeading } from "redux-saga/effects";
import * as R from "@utils/api/requests";
import * as A from "./launchesActions";
import * as T from "./launchesTypes";

function* getLaunches() {
  try {
    yield put(A.setLoaderLaunches(["booked", "past", "upcoming"]));
    const past = yield call(R.getLaunchesRequest, T.LaunchesGetTypes.past);
    const upcoming = yield call(R.getLaunchesRequest, T.LaunchesGetTypes.upcoming);
    yield put(A.setLaunches({ past, upcoming, booked: [] }));
  } catch (e) {
    if (e instanceof Error) yield put(A.getLaunchesActionFailure(e.message));
  } finally {
    yield put(A.setLoaderLaunches([]));
  }
}

function* bookLaunch({ payload }: PayloadAction<T.BookRequest>) {
  try {
    const { id, type, cardsState, callBack } = payload;
    if (type === T.LaunchesBookTypes.cancel) {
      yield put(A.setLoaderLaunches(["upcoming"]));
    }
    yield call(R.bookLaunchRequest, { id, type });
    yield put(
      A.setLaunches({
        past: cardsState.past,
        upcoming: cardsState.upcoming,
        booked: cardsState.booked
      })
    );
    callBack?.();
  } catch (e) {
    if (e instanceof Error) yield put(A.bookLaunchesActionFailure(e.message));
  } finally {
    yield put(A.setLoaderLaunches([]));
  }
}

function* getLaunch({ payload }: PayloadAction<string>) {
  try {
    yield put(A.setLoaderLaunches(["single"]));
    const launch = yield call(R.getLaunchRequest, payload);
    yield put(A.getLaunchActionSuccess(launch));
  } catch (e) {
    if (e instanceof Error) yield put(A.getLaunchActionFailure(e.message));
  } finally {
    yield put(A.setLoaderLaunches([]));
  }
}

export default function* watchOnLaunchesChange(): Generator {
  yield takeLeading(A.getLaunchesActionRequest, getLaunches);
  yield takeLeading(A.getLaunchActionRequest, getLaunch);
  yield takeLeading(A.bookLaunchesActionRequest, bookLaunch);
}

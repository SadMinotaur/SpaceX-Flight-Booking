import { PayloadAction } from "@reduxjs/toolkit";
import { takeLatest } from "redux-saga/effects";
import * as A from "./userActions";

function* signInUser(payloadAction: PayloadAction<string>) {
  // try {
  // const { data, token } = yield call(R.loginRequest, { email, password });
  // yield put(A.loginActionSuccess({ ...data, token }));
  // } catch (e) {
  // sagaError(A.loginActionFailure, e);
  // }
}

export default function* watchOnUserChange(): Generator {
  yield takeLatest(A.loginActionRequest, signInUser);
}

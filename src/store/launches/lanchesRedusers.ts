import { createReducer } from "@reduxjs/toolkit";
import * as A from "./launchesActions";
import * as T from "./launchesTypes";

export const initStoreState: T.LaunchesInfo = {
  past: [],
  upcoming: [],
  booked: [],
  loader: false
};

export default createReducer(initStoreState, (builder) => {
  builder
    .addCase(A.getLaunchesActionSuccess, (state, { payload }) => ({
      ...state,
      ...payload
    }))
    .addCase(A.setLoaderLaunches, (state, { payload }) => ({ ...state, loader: payload }))
    .addCase(A.cleanLaunchesData, () => initStoreState);
});

import { createReducer } from "@reduxjs/toolkit";
import * as A from "./launchesActions";
import { LaunchesInfo } from "./launchesTypes";

export const initStoreState: LaunchesInfo = {
  past: [],
  upcoming: [],
  booked: [],
  loader: [],
  singleFlight: null
};

export default createReducer(initStoreState, (builder) => {
  builder
    .addCase(A.setLaunches, (state, { payload }) => ({
      ...state,
      ...payload
    }))
    .addCase(A.getLaunchActionSuccess, (state, { payload }) => ({
      ...state,
      singleFlight: payload
    }))
    .addCase(A.setLoaderLaunches, (state, { payload }) => ({ ...state, loader: payload }))
    .addCase(A.cleanLaunchesData, () => initStoreState);
});

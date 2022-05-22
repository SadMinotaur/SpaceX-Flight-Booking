import { createAction } from "@reduxjs/toolkit";
import { LaunchesReducerFetched } from "./launchesTypes";

export const getLaunchesActionRequest = createAction("LAUNCHES_REQUEST");
export const getLaunchesActionSuccess = createAction<LaunchesReducerFetched>("LAUNCHES_SUCCESS");
export const getLaunchesActionFailure = createAction<string>("LAUNCHES_FAILURE");

export const cleanLaunchesData = createAction<void>("CLEAN_LAUNCHES_DATA");
export const setLoaderLaunches = createAction<boolean>("SET_LOADER_LAUNCHES");

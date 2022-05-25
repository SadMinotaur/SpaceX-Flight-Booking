import { createAction } from "@reduxjs/toolkit";
import { BookRequest, LaunchesState, LaunchType, LoaderTypes } from "./launchesTypes";

export const getLaunchesActionRequest = createAction("GET_LAUNCHES_REQUEST");
export const getLaunchesActionFailure = createAction<string>("GET_LAUNCHES_FAILURE");

export const bookLaunchesActionRequest = createAction<BookRequest>("BOOK_LAUNCH_REQUEST");
export const bookLaunchesActionFailure = createAction<string>("BOOK_LAUNCH_FAILURE");

export const setLaunches = createAction<LaunchesState>("SET_LAUNCHES");

export const getLaunchActionRequest = createAction<string>("GET_LAUNCH_REQUEST");
export const getLaunchActionSuccess = createAction<LaunchType>("GET_LAUNCH_SUCCESS");
export const getLaunchActionFailure = createAction<string>("GET_LAUNCH_FAILURE");

export const cleanLaunchesData = createAction<void>("CLEAN_LAUNCHES_DATA");

export const setLoaderLaunches = createAction<LoaderTypes[]>("SET_LOADER_LAUNCHES");

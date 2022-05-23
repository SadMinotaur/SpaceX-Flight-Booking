import { createAction } from "@reduxjs/toolkit";
import { BookRequest, LaunchesState } from "./launchesTypes";

export const getLaunchesActionRequest = createAction("LAUNCHES_REQUEST");
export const getLaunchesActionFailure = createAction<string>("LAUNCHES_FAILURE");

export const bookLaunchesActionRequest = createAction<BookRequest>("BOOK_LAUNCH_REQUEST");
export const bookLaunchesActionFailure = createAction<string>("BOOK_LAUNCH_FAILURE");

export const setLaunches = createAction<LaunchesState>("SET_LAUNCHES");

export const cleanLaunchesData = createAction<void>("CLEAN_LAUNCHES_DATA");

export const setLoaderLaunches = createAction<boolean>("SET_LOADER_LAUNCHES");

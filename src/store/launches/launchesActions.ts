import { createAction } from "@reduxjs/toolkit";
import * as T from "./launchesTypes";

export const getLaunchesActionRequest = createAction("LAUNCHES_REQUEST");
export const getLaunchesActionFailure = createAction<string>("LAUNCHES_FAILURE");

export const bookLaunchesActionRequest = createAction<T.BookRequest>("BOOK_LAUNCH_REQUEST");
export const bookLaunchesActionFailure = createAction<string>("BOOK_LAUNCH_FAILURE");

export const setLaunches = createAction<T.LaunchesState>("SET_LAUNCHES");

export const cleanLaunchesData = createAction<void>("CLEAN_LAUNCHES_DATA");

export const setLoaderLaunches = createAction<T.LoaderTypes>("SET_LOADER_LAUNCHES");

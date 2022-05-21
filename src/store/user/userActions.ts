import { createAction } from "@reduxjs/toolkit";

export const loginActionRequest = createAction<string>("LOGIN_USER_REQUEST");
export const loginActionSuccess = createAction<string>("LOGIN_USER_SUCCESS");
export const loginActionFailure = createAction<string>("LOGIN_USER_FAILURE");

export const cleanUserData = createAction<void>("CLEAN_USER_DATA");

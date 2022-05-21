import { createReducer } from "@reduxjs/toolkit";
import * as A from "./userActions";
import * as T from "./userTypes";

export const initStoreState: T.UserInfo = {
  token: ""
};

export default createReducer(initStoreState, (builder) => {
  builder
    .addCase(A.loginActionSuccess, (state: T.UserInfo, { payload }) => ({
      ...state,
      token: payload
    }))
    .addCase(A.cleanUserData, () => initStoreState);
});

import { store } from "@store/store";
import { cleanUserData } from "@store/user/userActions";
import axios, { AxiosError } from "axios";

const instance = axios.create({
  baseURL: ""
});

instance.interceptors.request.use((config) => {
  const { token } = store.getState().user;
  if (token) {
    // config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// instance.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       store.dispatch(cleanUserData());
//     }
//   }
// );

export default instance;

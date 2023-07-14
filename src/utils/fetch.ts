import axios from "axios";
import { sessionTokenAtom } from "@/stores/auth";
import { appStore } from "@/stores";

const instance = axios.create({
  baseURL: "http://localhost:4200",
});

instance.interceptors.request.use(
  (config) => {
    const sessionToken = appStore.get(sessionTokenAtom);

    if (sessionToken) {
      console.log("adding session token", sessionToken);
      config.headers["Authorization"] = `Bearer ${sessionToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// instance.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error: AxiosError) {
//     return new SparkAxiosError(error.message)
//   }
// );
export default instance;

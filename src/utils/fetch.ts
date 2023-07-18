import axios, { AxiosError } from "axios"

const instance = axios.create({
  baseURL: "http://localhost:4200",
  withCredentials: true,
})

export const registerAuthToken = (token: string) => {
  instance.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = `Bearer ${token}`
      return config
    },
    (error) => Promise.reject(error)
  )
}

instance.interceptors.response.use(undefined, (error: AxiosError) => {
  console.log(error.response)
  return Promise.reject(error)
})

// instance.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error: AxiosError) {
//     return new SparkAxiosError(error.message)
//   }
// );
export default instance

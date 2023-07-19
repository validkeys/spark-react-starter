import { ApiError } from "@/types"
import axios, { AxiosError, AxiosResponse } from "axios"

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

export default instance

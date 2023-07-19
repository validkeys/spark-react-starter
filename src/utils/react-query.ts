import { ApiError, ApiErrorResponse } from "@/types"
import { QueryClient } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios"
export const queryClient = new QueryClient()

type ExtractErrorInput = AxiosError | Error

export const extractErrorMessages = (error: ExtractErrorInput): ApiError[] => {
  if (error instanceof AxiosError) {
    const response = error.response as AxiosResponse<ApiErrorResponse>
    const errors = response.data.errors || []
    return errors
  } else {
    return [
      {
        statusCode: 400,
        error: error.message,
        message: error.message,
      },
    ]
  }
}

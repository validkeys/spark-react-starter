import { AxiosError } from "axios"
import { ApiErrorResponse } from "@/types"
import { useRouteError } from "react-router-dom"

export function ErrorBoundary() {
  const error = useRouteError()

  if (error instanceof AxiosError) {
    const statusText = error.response?.statusText
    const data = error.response?.data as ApiErrorResponse
    const errors = data.errors || []
    return (
      <div>
        <div className="text-xl">{statusText || "Something went wrong"}</div>
        {errors.map((e, idx: number) => {
          return <div key={`error-${idx}`}>{e.message}</div>
        })}
      </div>
    )
  }
  return <div>{(error as Error).message}</div>
}

import { ApiError } from "@/types"
import { useEffect } from "react"
import { toast } from "react-toastify"

const toMessage = (error: ApiError) => {
  return `${error.error}: ${error.message}`
}

export const UiErrorNotifications = ({ errors }: { errors: ApiError[] }) => {
  useEffect(() => {
    errors.forEach((error) => {
      const message = toMessage(error)
      toast.error(message, {
        toastId: message,
      })
    })
  }, [errors])
  return <></>
}

import { extractErrorMessages } from "@/utils/react-query"
import { UseMutationResult } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { UiErrorNotifications } from "./UiErrorNotifications"

export const ReactQueryErrorNotifications = ({
  query,
}: {
  query: UseMutationResult<any, unknown, any, unknown>
}) => {
  if (query.isError) {
    if (query.error instanceof AxiosError) {
      const errors = extractErrorMessages(query.error)
      console.log({ errors })
      return <UiErrorNotifications errors={errors} />
    }
  }

  return <></>
}

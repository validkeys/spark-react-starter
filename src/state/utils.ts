import { queryClient } from "../utils/react-query"
import { AuthenticatedResponse } from "@/types"
import { getSessionQuery } from "./queries"

export const isAuthenticated = (): boolean => {
  const session = queryClient.getQueryData<AuthenticatedResponse>(
    getSessionQuery().queryKey
  )

  return session && session.user ? true : false
}

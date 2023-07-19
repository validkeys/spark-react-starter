import { useQuery, useMutation } from "@tanstack/react-query"
import {
  getSessionQuery,
  destroySessionQuery,
  postSessionQuery,
  organizationQuery,
  organizationAdvisorQuery,
  userPermitsQuery,
} from "./queries"
import { registerAuthToken } from "@/utils/fetch"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { queryClient } from "@/utils/react-query"

const LOCAL_STORAGE_TOKEN_NAME = "sparkToken"

export const useSession = () => {
  // Load persisted local storage token on app load
  useEffect(() => {
    const existingToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)

    if (existingToken) {
      registerAuthToken(existingToken)
    }
  }, [])

  const session = useQuery(getSessionQuery())

  if (session.data) {
    const permits = session.data.user.permits || []
    if (permits.length) {
      queryClient.setQueryData(
        userPermitsQuery(session.data.user.id).queryKey,
        {
          permits: permits,
        }
      )
    }
  }

  // Monitor session token for changes
  useEffect(() => {
    if (session?.data?.token) {
      localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, session.data.token)
    } else {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
    }
  }, [session.data?.token])

  return {
    ...session,
    isAuthenticated: !!session.data,
  }
}

export const useLogin = () => {
  const login = useMutation(postSessionQuery())

  if (login.data) {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, login.data.token)
    registerAuthToken(login.data.token)
    queryClient.setQueryData(getSessionQuery().queryKey, login.data)
  }

  return login
}

export const useLogout = () => {
  const logout = useMutation(destroySessionQuery())

  if (logout.isSuccess) {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
    window.location.reload()
  }

  return logout
}

export const useCurrentOrganization = () => {
  const params = useParams()

  if (!params.organizationId) {
    throw new Error("No organizationId found in url params")
  }

  return useQuery(organizationQuery(params.organizationId))
}

export const useCurrentAdvisor = () => {
  const params = useParams()

  if (!params.organizationId) {
    throw new Error("No organizationId found in url params")
  } else if (!params.advisorId) {
    throw new Error("No advisorId found in url params")
  }

  return useQuery(
    organizationAdvisorQuery({
      organizationId: params.organizationId,
      advisorId: params.advisorId,
    })
  )
}

export const useUserPermits = () => {
  const { data: session, isAuthenticated } = useSession()
  const userPermitQuery = useQuery({
    ...userPermitsQuery(session?.user?.id || ""),
    enabled: isAuthenticated,
    select(data) {
      return data.permits
    },
  })
  return userPermitQuery
}

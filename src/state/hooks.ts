import { useQuery, useMutation } from "@tanstack/react-query"
import {
  getSessionQuery,
  destroySessionQuery,
  postSessionQuery,
  organizationQuery,
  organizationAdvisorQuery,
} from "./queries"
import { registerAuthToken } from "@/utils/fetch"
import { useEffect } from "react"
import { useParams } from "react-router-dom"

const LOCAL_STORAGE_TOKEN_NAME = "sparkToken"

export const useSession = () => {
  // Load persisted local storage token on app load
  useEffect(() => {
    const existingToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)
    console.log(`found existing token: ${existingToken}`)

    if (existingToken) {
      console.log("registering existing token")
      registerAuthToken(existingToken)
    }
  }, [])

  const session = useQuery(getSessionQuery())

  // Monitor session token for changes
  useEffect(() => {
    if (session?.data?.token) {
      console.log("setting new token", session.data.token)
      localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, session.data.token)
    } else {
      console.log("removing token")
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

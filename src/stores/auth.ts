import { atom, useAtom, useAtomValue } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { atomsWithMutation, atomsWithQuery } from "jotai-tanstack-query"
import { appStore } from "."
import { type User, type AuthenticatedResponse } from "@/types"
import { useEffect } from "react"
import { getSession, postSession, destroySession } from "@/data"

export interface LoginCredentials {
  email: string
  password: string
}

// Atoms
export const isAuthenticatedAtom = atom(false)
export const authenticatedUserAtom = atom<User | null>(null)
export const sessionTokenAtom = atomWithStorage<string | null>(
  "sparkToken",
  null
)
export const routeAfterAuthenticationAtom = atom("/")
export const sessionAtom = atom((get) => ({
  isAuthenticated: get(isAuthenticatedAtom),
  user: get(authenticatedUserAtom),
  sessionToken: get(sessionTokenAtom),
}))

// Login Atom
const [, loginQueryAtom] = atomsWithMutation(() => ({
  mutationKey: ["login"],
  mutationFn: postSession,
}))

// Current Session Request Atom
const [getSessionDataAtom, getSessionQueryAtom] =
  atomsWithQuery<AuthenticatedResponse>((get) => ({
    queryKey: ["session.get", get(sessionTokenAtom)],
    queryFn: getSession,
    retry: false,
  }))

// Logout Atom
const [, logoutQueryAtom] = atomsWithMutation(() => ({
  mutationKey: ["logout"],
  mutationFn: destroySession,
}))

// Hooks

export const useLogin = () => {
  const [loginState, login] = useAtom(loginQueryAtom)

  useEffect(() => {
    if (loginState.data && loginState.isSuccess) {
      onAuthenticated(loginState.data)
    }
  }, [loginState.data])

  return { login, ...loginState }
}

export const useSession = () => {
  const queryStatus = useAtomValue(getSessionQueryAtom)
  const session = useAtomValue(sessionAtom)

  useEffect(() => {
    if (queryStatus.data && !queryStatus.isFetching) {
      onAuthenticated(queryStatus.data)
    }
  }, [queryStatus.data])

  return { session, ...queryStatus, onAuthenticated }
}

export const useLogout = () => {
  const [logoutState, logout] = useAtom(logoutQueryAtom)
  return { logout, ...logoutState }
}

const onAuthenticated = (response: AuthenticatedResponse) => {
  appStore.set(isAuthenticatedAtom, true)
  appStore.set(authenticatedUserAtom, response.user)
  appStore.set(sessionTokenAtom, response.token)
}

// Debug
isAuthenticatedAtom.debugLabel = "auth.isAuthenticated"
authenticatedUserAtom.debugLabel = "auth.authenticatedUser"
sessionTokenAtom.debugLabel = "auth.sessionToken"
routeAfterAuthenticationAtom.debugLabel = "auth.routeAfterAuthentication"
sessionAtom.debugLabel = "auth.session"
loginQueryAtom.debugLabel = "auth.loginQuery"
getSessionQueryAtom.debugLabel = "auth.getSessionQuery"
logoutQueryAtom.debugLabel = "auth.logoutQuery"

export { getSessionQueryAtom, getSessionDataAtom }

export const useCurrentUserValue = () => {
  return useAtomValue(authenticatedUserAtom)
}

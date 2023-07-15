import { atom, useAtom, useAtomValue, useSetAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { atomsWithMutation, atomsWithQuery } from "jotai-tanstack-query"
import axios from "../utils/fetch"
import { appStore } from "."
import { type User } from "@/types"

export interface AuthenticatedResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export const isAuthenticatedAtom = atom(false)
isAuthenticatedAtom.debugLabel = "auth.isAuthenticated"

export const authenticatedUserAtom = atom<User | null>(null)
authenticatedUserAtom.debugLabel = "auth.authenticatedUser"

export const sessionTokenAtom = atomWithStorage<string | null>(
  "sparkToken",
  null
)
sessionTokenAtom.debugLabel = "auth.sessionToken"

export const routeAfterAuthenticationAtom = atom("/")
routeAfterAuthenticationAtom.debugLabel = "auth.routeAfterAuthentication"

const fetchers = {
  create: async (
    credentials: LoginCredentials
  ): Promise<AuthenticatedResponse> => {
    // await new Promise((r) => setTimeout(r, 1000));
    const result = await axios.post<AuthenticatedResponse>(
      "/api/v1/sessions",
      credentials
    )
    return result.data
  },
  get: async (): Promise<AuthenticatedResponse> => {
    // await new Promise((r) => setTimeout(r, 1000));
    const result = await axios.get<AuthenticatedResponse>("/api/v1/sessions")
    return result.data
  },
  destroy: async (): Promise<null> => {
    await axios.delete("/api/v1/sessions")
    return null
  },
}

export const sessionAtom = atom((get) => ({
  isAuthenticated: get(isAuthenticatedAtom),
  user: get(authenticatedUserAtom),
  sessionToken: get(sessionTokenAtom),
}))
sessionAtom.debugLabel = "auth.session"

const [, loginQueryAtom] = atomsWithMutation(() => ({
  mutationKey: ["login"],
  mutationFn: fetchers.create,
  onSuccess(data) {
    console.log("onSuccess", data)
    actions.onAuthenticated(data)
  },
}))
loginQueryAtom.debugLabel = "auth.loginQuery"

const [getSessionDataAtom, getSessionQueryAtom] =
  atomsWithQuery<AuthenticatedResponse>((get) => ({
    queryKey: ["session.get", get(sessionTokenAtom)],
    queryFn: fetchers.get,
    retry: false,
    onSuccess(data) {
      console.log("checking session!")
      actions.onAuthenticated(data)
    },
  }))
getSessionQueryAtom.debugLabel = "auth.getSessionQuery"

const [, logoutQueryAtom] = atomsWithMutation(() => ({
  mutationKey: ["logout"],
  mutationFn: fetchers.destroy,
  onSuccess(data) {
    console.log("onSuccess", data)
    actions.onUnauthenticated()
  },
}))
logoutQueryAtom.debugLabel = "auth.logoutQuery"

export { getSessionQueryAtom, getSessionDataAtom }

export const actions = {
  onAuthenticated(response: AuthenticatedResponse) {
    // console.log("onAuthenticated", response);
    // appStore.set(isAuthenticatedAtom, true);
    // appStore.set(authenticatedUserAtom, response.user);
    // appStore.set(sessionTokenAtom, response.token);
  },
  onUnauthenticated() {
    console.log("onUnauthenticated")
    appStore.set(isAuthenticatedAtom, false)
    appStore.set(authenticatedUserAtom, null)
    appStore.set(sessionTokenAtom, null)
  },
}

export const useLogin = () => {
  const [loginState, login] = useAtom(loginQueryAtom)
  return { login, ...loginState }
}

export const useLogout = () => {
  const [logoutState, logout] = useAtom(logoutQueryAtom)
  return { logout, ...logoutState }
}

export const useSession = () => {
  const queryStatus = useAtomValue(getSessionQueryAtom)
  const session = useAtomValue(sessionAtom)

  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom)
  const setAuthenticatedUser = useSetAtom(authenticatedUserAtom)
  const setSessionToken = useSetAtom(sessionTokenAtom)

  const onAuthenticated = (response: AuthenticatedResponse) => {
    setIsAuthenticated(true)
    setAuthenticatedUser(response.user)
    setSessionToken(response.token)
  }
  return { session, ...queryStatus, onAuthenticated }
}

export const useCurrentUserValue = () => {
  return useAtomValue(authenticatedUserAtom)
}

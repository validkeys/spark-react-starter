import { atom, useAtom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { atomsWithMutation, atomsWithQuery } from "jotai-tanstack-query";
import axios from "../utils/fetch";
import { appStore } from ".";

export interface AuthenticatedResponse {
  user: User;
  token: string;
}

export interface User {
  id: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const isAuthenticatedAtom = atom(false);
export const authenticatedUserAtom = atom<User | null>(null);
export const sessionTokenAtom = atomWithStorage<string | null>(
  "sparkToken",
  null
);

const fetchers = {
  login: async (
    credentials: LoginCredentials
  ): Promise<AuthenticatedResponse> => {
    await new Promise((r) => setTimeout(r, 1000));
    const result = await axios.post<AuthenticatedResponse>(
      "/api/v1/sessions",
      credentials
    );
    return result.data;
  },
  getSession: async (): Promise<AuthenticatedResponse> => {
    await new Promise((r) => setTimeout(r, 1000));
    const result = await axios.get<AuthenticatedResponse>("/api/v1/sessions");
    return result.data;
  },
};

export const sessionAtom = atom((get) => ({
  isAuthenticated: get(isAuthenticatedAtom),
  user: get(authenticatedUserAtom),
  sessionToken: get(sessionTokenAtom),
}));

const [, loginQueryAtom] = atomsWithMutation(() => ({
  mutationKey: ["login"],
  mutationFn: fetchers.login,
  onSuccess(data) {
    console.log("onSuccess", data);
    actions.onAuthenticated(data);
  },
}));

const [, getSessionQueryAtom] = atomsWithQuery<AuthenticatedResponse>(
  (get) => ({
    queryKey: ["session.get", get(sessionTokenAtom)],
    queryFn: fetchers.getSession,
    retry: false,
    onSuccess(data) {
      console.log("checking session!");
      actions.onAuthenticated(data);
    },
  })
);

export const actions = {
  onAuthenticated(response: AuthenticatedResponse) {
    console.log("onAuthenticated", response);
    appStore.set(isAuthenticatedAtom, true);
    appStore.set(authenticatedUserAtom, response.user);
    appStore.set(sessionTokenAtom, response.token);
  },
  onUnauthenticated() {
    console.log("onUnauthenticated");
    appStore.set(isAuthenticatedAtom, false);
    appStore.set(authenticatedUserAtom, null);
    appStore.set(sessionTokenAtom, null);
  },
};

export const useLogin = () => {
  const [loginState, login] = useAtom(loginQueryAtom);
  return { login, ...loginState };
};

export const useSession = () => {
  const queryStatus = useAtomValue(getSessionQueryAtom);
  const session = useAtomValue(sessionAtom);
  return { session, ...queryStatus };
};

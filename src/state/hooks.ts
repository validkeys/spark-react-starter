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
import { RefObject, useEffect, useRef, useState } from "react"
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
    console.warn(
      `useCurrentOrganization found no organizationId in params. Resulting query will be disabled`
    )
  }

  return useQuery(organizationQuery(params.organizationId as string))
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

export const useRefPosition = <T extends HTMLElement>(ref: RefObject<T>) => {
  const [pos, setPos] = useState({
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  })

  useEffect(() => {
    if (ref.current) {
      const rects = ref.current.getBoundingClientRect()
      setPos(rects)
    }
  }, [ref])

  return pos
}

type ClickAwayOptions = {
  ref?: RefObject<HTMLElement>
  exceptionRef?: RefObject<HTMLElement>
}

const refContainsTarget = (
  ref: RefObject<HTMLElement | undefined>,
  target: HTMLElement
) => {
  if (ref && ref.current) {
    return ref.current.contains(target)
  }

  return false
}

export const useClickAway = (cb: () => void, options?: ClickAwayOptions) => {
  const ref = options?.ref || useRef<HTMLElement>()

  useEffect(() => {
    document.addEventListener("mousedown", handleClick)

    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  }, [])

  const handleClick = (event: MouseEvent) => {
    const { target } = event
    const exceptionRef = options?.exceptionRef || null

    if (!target) {
      return
    }

    const wrapperRefContainsTarget = refContainsTarget(
      ref,
      target as HTMLElement
    )

    let isExceptionRef = false

    if (exceptionRef && exceptionRef.current) {
      isExceptionRef =
        exceptionRef.current === target ||
        refContainsTarget(exceptionRef, target as HTMLElement)
    }

    if (wrapperRefContainsTarget || isExceptionRef) {
      return
    } else {
      cb()
    }
  }

  return ref
}

export const useTailwindFullscreen = () => {
  useEffect(() => {
    document.body.classList.add("h-full")
    document.getElementById("root")?.classList.add("h-full")
    document.documentElement.classList.add("h-full", "bg-white")

    return () => {
      document.body.classList.remove("h-full")
      document.documentElement.classList.remove("h-full", "bg-white")
      document.getElementById("root")?.classList.remove("h-full")
    }
  }, [])
}

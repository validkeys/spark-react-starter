import { LoginCredentials } from "@/types"
import axios from "../utils/fetch"
import {
  AdvisorApiResponse,
  OrganizationApiResponse,
  PermitApiResponse,
  AuthenticatedResponse,
} from "@/types"

// Organization Queries
export const organizationQuery = (organizationId: string) => ({
  queryKey: ["organizations", organizationId],
  queryFn: async () => {
    const result = await axios.get<OrganizationApiResponse>(
      `/api/v1/organizations/${organizationId}`
    )
    return result.data
  },
})

type AdvisorQueryParams = {
  organizationId: string
  advisorId: string
}

export const organizationAdvisorQuery = (params: AdvisorQueryParams) => ({
  queryKey: ["advisors", params.organizationId, params.advisorId],
  queryFn: async () => {
    const { data } = await axios.get<AdvisorApiResponse>(
      `/api/v1/organizations/${params.organizationId}/advisors/${params.advisorId}`
    )
    return data
  },
})

export const userPermitsQuery = (userId: string) => ({
  queryKey: ["user", userId, "permits", "list"],
  queryFn: async () => {
    const { data } = await axios.get<PermitApiResponse>(
      `/api/v1/users/${userId}/permits`
    )
    return data
  },
})

export const getSessionQuery = () => {
  return {
    queryKey: ["sessions", "detail"],
    queryFn: async () => {
      const { data } = await axios.get<AuthenticatedResponse>(
        "/api/v1/sessions"
      )
      return data
    },
    retry: false,
  }
}

export const postSessionQuery = () => {
  return {
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await axios.post<AuthenticatedResponse>(
        "/api/v1/sessions",
        credentials
      )
      return result.data
    },
  }
}

export const destroySessionQuery = () => {
  return {
    mutationFn: async () => {
      const result = await axios.delete<void>("/api/v1/sessions")
      return result.data
    },
  }
}

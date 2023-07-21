import { ClientSearchResults, LoginCredentials } from "@/types"
import axios from "../utils/fetch"
import {
  AdvisorApiResponse,
  OrganizationApiResponse,
  PermitApiResponse,
  AuthenticatedResponse,
  MoneyMoveResponse,
  OpsRequestBatchUpdatePayload,
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
  enabled: !!organizationId,
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

export const getOpsMoneyMoveRequests = (page = 0, limit = 0) => {
  return {
    queryKey: ["ops", "money-move-requests", page, limit],
    queryFn: async () => {
      const { data } = await axios.get<MoneyMoveResponse>(
        "/api/v1/ops/mm-requests",
        {
          params: {
            page,
            limit,
          },
        }
      )
      return data
    },
    keepPreviousData: true,
  }
}

type ClientSearchParams = {
  organizationId?: string | null
  advisorId?: string | null
  query: string
}

export const clientSearchQuery = ({
  organizationId,
  advisorId,
  query,
}: ClientSearchParams) => {
  const queryKey = ["client.search", { organizationId, advisorId, query }]
  return {
    queryKey,
    queryFn: async () => {
      let url = "/api/v1"

      if (organizationId) {
        url += `/organizations/${organizationId}`
      }

      if (advisorId) {
        url += `/advisors/${advisorId}`
      }

      const { data } = await axios.get<ClientSearchResults>(
        `${url}/clientSummaries`,
        {
          params: { query },
        }
      )

      return data
    },
  }
}

export const updateOpsMoneyMoveRequests = () => {
  return {
    mutationKey: ["ops", "mm", "batch.update"],
    mutationFn: async (payload: OpsRequestBatchUpdatePayload) => {
      const { data } = await axios.post<MoneyMoveResponse>(
        "/api/v1/ops/mm-requests/batch-update",
        payload
      )
      return data
    },
  }
}

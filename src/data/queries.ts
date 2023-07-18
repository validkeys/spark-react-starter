import {
  getOrganization,
  getOrganizationAdvisors,
  getUserPermits,
} from "./fetchers"

export const organizationQuery = (organizationId: string) => ({
  queryKey: ["organizations", organizationId],
  queryFn: async () => {
    return getOrganization(organizationId)
  },
})

type AdvisorQueryParams = {
  organizationId: string
  advisorId: string
}

export const advisorQuery = (params: AdvisorQueryParams) => ({
  queryKey: ["advisors", params.organizationId, params.advisorId],
  queryFn: async () => {
    return getOrganizationAdvisors(params.organizationId, params.advisorId)
  },
})

export const userPermitsQuery = (userId: string) => ({
  queryKey: ["user", userId, "permits", "list"],
  queryFn: () => getUserPermits(userId),
})

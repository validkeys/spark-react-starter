import { atomsWithQuery } from "jotai-tanstack-query"
import axios from "../../../utils/fetch"
import { OrganizationApiResponse } from "@/types"
import { atom, useAtomValue } from "jotai"

// Atoms
const currentOrganizationIdAtom = atom<string | null>(null)

const [, currentOrganizationQueryAtom] = atomsWithQuery((get) => {
  const organizationId = get(currentOrganizationIdAtom)
  return {
    ...organizationQuery(organizationId as string),
    enabled: organizationId !== null,
  }
})

// Queries
export const organizationQuery = (id: string) => ({
  queryKey: ["organizations", id],
  queryFn: async () => {
    const { data } = await axios.get<OrganizationApiResponse>(
      `/api/v1/organizations/${id}`
    )
    return data
  },
})

// Hooks
export const useCurrentOrganization = () => {
  const status = useAtomValue(currentOrganizationQueryAtom)
  return {
    organization: status.data?.organization,
    ...status,
  }
}

export { currentOrganizationQueryAtom, currentOrganizationIdAtom }

// Debug
currentOrganizationIdAtom.debugLabel = "currentOrganizationId"
currentOrganizationQueryAtom.debugLabel = "currentOrganizationQuery"

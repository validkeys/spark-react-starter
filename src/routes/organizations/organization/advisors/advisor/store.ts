import { atomsWithQuery } from "jotai-tanstack-query"
import axios from "../../../../../utils/fetch"
import { AdvisorApiResponse } from "@/types"
import { atom, useAtomValue } from "jotai"
import { currentOrganizationIdAtom } from "../../store"

// Atoms
const currentAdvisorIdAtom = atom<string | null>(null)

const [, currentAdvisorQueryAtom] = atomsWithQuery((get) => {
  const organizationId = get(currentOrganizationIdAtom)
  const advisorId = get(currentAdvisorIdAtom)
  return {
    ...advisorQuery(organizationId as string, advisorId as string),
    enabled: organizationId !== null && advisorId !== null,
  }
})

// Queries
export const advisorQuery = (organizationId: string, id: string) => ({
  queryKey: ["advisors", organizationId, id],
  queryFn: async () => {
    const { data } = await axios.get<AdvisorApiResponse>(
      `/api/v1/organizations/${organizationId}/advisors/${id}`
    )
    return data
  },
})

// Hooks
export const useCurrentAdvisor = () => {
  const status = useAtomValue(currentAdvisorQueryAtom)
  return {
    advisor: status.data?.advisor,
    ...status,
  }
}

// Debug
currentAdvisorIdAtom.debugLabel = "currentAdvisorId"

export { currentAdvisorQueryAtom, currentAdvisorIdAtom }

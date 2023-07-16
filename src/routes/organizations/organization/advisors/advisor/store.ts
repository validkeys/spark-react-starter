import { atomsWithQuery } from "jotai-tanstack-query"
import axios from "../../../../../utils/fetch"
import { AdvisorApiResponse } from "@/types"
import { useAtomValue } from "jotai"
import {
  contextAdvisorIdAtom,
  contextOrganizationIdAtom,
} from "@/stores/context"

// Atoms

const [, currentAdvisorQueryAtom] = atomsWithQuery((get) => {
  const organizationId = get(contextOrganizationIdAtom)
  const advisorId = get(contextAdvisorIdAtom)
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

export { currentAdvisorQueryAtom }

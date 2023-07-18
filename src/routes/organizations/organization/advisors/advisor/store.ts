import { atomsWithQuery } from "jotai-tanstack-query"
import { useAtomValue } from "jotai"
import {
  contextAdvisorIdAtom,
  contextOrganizationIdAtom,
} from "@/stores/context"
import { advisorQuery } from "@/data"

// Atoms

const [, currentAdvisorQueryAtom] = atomsWithQuery((get) => {
  const organizationId = get(contextOrganizationIdAtom) as string
  const advisorId = get(contextAdvisorIdAtom) as string
  return {
    ...advisorQuery({ organizationId, advisorId }),
    enabled: organizationId !== null && advisorId !== null,
  }
})

// Queries

// Hooks
export const useCurrentAdvisor = () => {
  const status = useAtomValue(currentAdvisorQueryAtom)
  return {
    advisor: status.data?.advisor,
    ...status,
  }
}

export { currentAdvisorQueryAtom }

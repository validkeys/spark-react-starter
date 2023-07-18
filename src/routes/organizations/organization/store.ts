import { atomsWithQuery } from "jotai-tanstack-query"
import { useAtomValue } from "jotai"
import { contextOrganizationIdAtom } from "@/stores/context"
import { organizationQuery } from "@/data"

// Atoms
const [currentOrganizationDataAtom, currentOrganizationQueryAtom] =
  atomsWithQuery((get) => {
    const organizationId = get(contextOrganizationIdAtom)
    return {
      ...organizationQuery(organizationId as string),
      enabled: organizationId !== null,
      retry: false,
    }
  })

// Hooks
export const useCurrentOrganization = () => {
  const response = useAtomValue(currentOrganizationDataAtom)
  return response
}

export { currentOrganizationQueryAtom }

// Debug
currentOrganizationQueryAtom.debugLabel = "currentOrganizationQuery"

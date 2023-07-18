import { sessionAtom } from "./auth"
import { atomsWithQuery } from "jotai-tanstack-query"
import { Permit, PermitApiResponse } from "@/types"
import { useAtom } from "jotai"
import { userPermitsQuery } from "@/data"

const [permitsDataAtom] = atomsWithQuery((get) => {
  const session = get(sessionAtom)
  return {
    ...userPermitsQuery(session.user?.id || ""),
    enabled: !!session.user,
    select: (data: PermitApiResponse): Permit[] => {
      return data.permits
    },
  }
})

export const useCurrentUserPermits = () => {
  const [permits] = useAtom(permitsDataAtom)
  return permits
}

export { permitsDataAtom }

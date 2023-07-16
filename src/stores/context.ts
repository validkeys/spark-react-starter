import { useParams } from "react-router-dom"
import { atom, useAtomValue, useSetAtom } from "jotai"

type ContextName = "application" | "ops" | "organization" | "advisor" | "client"

export const contextNameAtom = atom<ContextName>("application")
export const contextOrganizationIdAtom = atom<string | null>(null)
export const contextAdvisorIdAtom = atom<string | null>(null)

export const contextAtom = atom((get) => {
  return {
    name: get(contextNameAtom),
    organizationId: get(contextOrganizationIdAtom),
    advisorId: get(contextAdvisorIdAtom),
  }
})

export const useSparkContext = () => {
  const params = useParams()
  const setContextName = useSetAtom(contextNameAtom)
  const setOrganizationId = useSetAtom(contextOrganizationIdAtom)
  const setAdvisorId = useSetAtom(contextAdvisorIdAtom)

  setOrganizationId(params.organizationId || null)
  setAdvisorId(params.advisorId || null)

  let contextName: ContextName = "application"
  if (params.advisorId) {
    contextName = "advisor"
  } else if (params.organizationId) {
    contextName = "organization"
  }

  setContextName(contextName)

  return useAtomValue(contextAtom)
}

contextNameAtom.debugLabel = "context.name"
contextOrganizationIdAtom.debugLabel = "context.organizationId"

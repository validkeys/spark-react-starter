import { ReactNode } from "react"
import { queryClientAtom } from "jotai-tanstack-query"
import { useHydrateAtoms } from "jotai/utils"
import { queryClient } from "../../utils/react-query"

export const HydrateAtoms = ({ children }: { children: ReactNode }) => {
  useHydrateAtoms([[queryClientAtom, queryClient]])
  return children
}

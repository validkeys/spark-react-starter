import { ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { getSessionQuery, userPermitsQuery } from "@/state"

export default function UserRequiredData({
  children,
}: {
  children: ReactNode
}) {
  const { data: session, isSuccess: isAuthenticated } = useQuery(
    getSessionQuery()
  )

  const { data: permitsData } = useQuery({
    ...userPermitsQuery(session?.user.id || ""),
    enabled: !!session?.user,
  })

  if (!isAuthenticated) {
    return <>No Session Detected</>
  }

  if (!permitsData) {
    return <>Loading Permits</>
  }

  return children
}

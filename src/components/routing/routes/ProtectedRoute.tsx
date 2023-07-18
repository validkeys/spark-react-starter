import { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useSession } from "@/state/hooks"

type ProtectedRouteProps = {
  children: ReactNode | ReactNode[]
}

export default function ProtectedRoute(props: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useSession()
  const location = useLocation()
  const pathAfterAuthentication = location.pathname + location.search

  if (isLoading) {
    return <div>Loading Session...</div>
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={`/login?redirect=${pathAfterAuthentication}`} replace />
    )
  }
  return props.children
}

import { Outlet } from "react-router-dom"
import { useSession, useLogout } from "@/state/hooks"

export const Component = () => {
  const { isAuthenticated } = useSession()
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate()
  }

  return (
    <div className="spark-app-container">
      {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
      <Outlet />
    </div>
  )
}

export default Component

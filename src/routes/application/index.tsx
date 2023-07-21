import { Outlet } from "react-router-dom"
// import { useSession, useLogout } from "@/state/hooks"

export const Component = () => {
  // const { isAuthenticated } = useSession()
  // const logout = useLogout()

  // const handleLogout = () => {
  //   logout.mutate()
  // }

  // {isAuthenticated && <button onClick={handleLogout}>Logout</button>}

  return <Outlet />
}

export default Component

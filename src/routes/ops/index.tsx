import { Link } from "react-router-dom"
import { Outlet } from "react-router-dom"

export const Component = () => {
  return (
    <div>
      <Link to="./banking-management">Banking Management</Link>
      <div>Ops Screen</div>
      <Outlet />
    </div>
  )
}

export default Component

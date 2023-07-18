import { Link } from "react-router-dom"
import { Outlet } from "react-router-dom"

export default function OpsPage() {
  return (
    <div>
      <Link to="./banking-management">Banking Management</Link>
      <div>Ops Screen</div>
      <Outlet />
    </div>
  )
}

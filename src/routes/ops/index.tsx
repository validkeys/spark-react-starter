import { Link } from "react-router-dom"
import { Outlet } from "react-router-dom"
import { DaisyTheme } from "@/components/daisy/Theme"

export const Component = () => {
  return (
    <DaisyTheme theme="luxury">
      <div>
        <Link to="./banking-management">Banking Management</Link>
        <div>Ops Screen</div>
        <Outlet />
      </div>
    </DaisyTheme>
  )
}

export default Component

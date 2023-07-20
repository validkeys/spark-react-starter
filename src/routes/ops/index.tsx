import { Outlet } from "react-router-dom"
import { DaisyTheme } from "@/components/daisy/Theme"
import { NavBar } from "@/components/ui/navs/NavBar"
import SessionRoute from "@/components/routing/routes/SessionRoute"
import { SearchBar } from "@/components/ui/navs/SearchBar"

export const Component = () => {
  return (
    <SessionRoute>
      <DaisyTheme theme="luxury">
        <NavBar
          items={[
            { name: "Dashboard", href: "/ops" },
            { name: "Banking Management", href: "/ops/banking-management" },
            { name: "Dashboard", href: "/a" },
            { name: "Dashboard", href: "/b" },
          ]}
          extras={() => {
            return (
              <SearchBar params={{ organizationId: null, advisorId: null }} />
            )
          }}
        />
        <Outlet />
      </DaisyTheme>
    </SessionRoute>
  )
}

export default Component

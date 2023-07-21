import { useCurrentAdvisor } from "@/state/hooks"
import { Outlet, useParams } from "react-router-dom"
import SessionRoute from "@/components/routing/routes/SessionRoute"
import { DaisyTheme } from "@/components/daisy/Theme"
import { NavBar } from "@/components/ui/navs/NavBar"
import { SearchBar } from "@/components/ui/navs/SearchBar"

export const Component = () => {
  const { isLoading, data: advisorResponse, isError } = useCurrentAdvisor()
  const params = useParams() as { organizationId: string; advisorId: string }
  const baseUrl = `/organizations/${params.organizationId}/advisors/${params.advisorId}`

  if (isLoading) {
    return <div>Loading Current Advisor</div>
  }

  if (isError) {
    return <div>Error loading advisor</div>
  }

  // const { advisor } = advisorResponse

  return (
    <SessionRoute>
      <DaisyTheme theme="light">
        <NavBar
          items={[
            { name: "Dashboard", href: baseUrl, end: true },
            { name: "Clients", href: `${baseUrl}/clients` },
            { name: "Tools", href: "/a" },
            { name: "Documents", href: "/b" },
          ]}
          extras={() => {
            return <SearchBar params={params} />
          }}
        />
        <Outlet />
      </DaisyTheme>
    </SessionRoute>
  )
}

export default Component

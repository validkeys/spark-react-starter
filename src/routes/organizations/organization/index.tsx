import { Outlet } from "react-router-dom"
import { useCurrentOrganization } from "@/stores/organization"

const OrganizationRoute = () => {
  const { isLoading, organization } = useCurrentOrganization()

  if (isLoading) {
    return <div>Fetching Organization</div>
  }

  return (
    <div>
      <div>
        Organization Route: <strong>{organization?.name}</strong>
      </div>
      <Outlet />
    </div>
  )
}

export default OrganizationRoute

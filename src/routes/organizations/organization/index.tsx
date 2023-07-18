import { Outlet } from "react-router-dom"
import { useCurrentOrganization } from "@/state/hooks"

export const Component = () => {
  const {
    data: organizationResponse,
    isLoading,
    isError,
  } = useCurrentOrganization()

  if (isLoading) {
    return <div>Loading Organization</div>
  }

  if (isError) {
    return <div>Error Loading Organization</div>
  }

  const { organization } = organizationResponse

  return (
    <div>
      <div>
        Organization Route: <strong>{organization.name}</strong>
      </div>

      <Outlet />
    </div>
  )
}

export default Component

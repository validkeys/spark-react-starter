import { Outlet } from "react-router-dom"
import { useCurrentOrganization } from "@/routes/organizations/organization/store"
import { Suspense } from "react"

const Fallback = () => {
  return <div>Fetching organization...</div>
}

const OrganizationRoute = () => {
  const { organization } = useCurrentOrganization()

  return (
    <div>
      <Suspense fallback={<Fallback />}>
        <div>
          Organization Route: <strong>{organization?.name}</strong>
        </div>
      </Suspense>

      <Outlet />
    </div>
  )
}

export default OrganizationRoute

import { useCurrentAdvisor } from "@/routes/organizations/organization/advisors/advisor/store"
import { Outlet } from "react-router-dom"

const AdvisorRoute = () => {
  const { isLoading, advisor } = useCurrentAdvisor()

  if (isLoading) {
    return <div>Loading Current Advisor</div>
  }

  return (
    <div>
      <div>
        Advisor Route: <strong>{advisor?.name}</strong>
      </div>
      <Outlet />
    </div>
  )
}

export default AdvisorRoute

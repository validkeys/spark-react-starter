import { useCurrentAdvisor } from "@/state/hooks"
import { Outlet } from "react-router-dom"

export const Component = () => {
  const { isLoading, data: advisorResponse, isError } = useCurrentAdvisor()

  if (isLoading) {
    return <div>Loading Current Advisor</div>
  }

  if (isError) {
    return <div>Error loading advisor</div>
  }

  const { advisor } = advisorResponse

  return (
    <div>
      <div>
        Advisor Route: <strong>{advisor.name}</strong>
      </div>
      <Outlet />
    </div>
  )
}

export default Component

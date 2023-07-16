import { Outlet } from "react-router-dom"
import { useSession } from "@/stores/auth"
import { ReactNode } from "react"

const SessionMonitor = ({ children }: { children: ReactNode }) => {
  const { isLoading, isSuccess, data, onAuthenticated } = useSession()

  if (isSuccess) {
    onAuthenticated(data)
  }

  if (isLoading) {
    return <div>Initial Load of Session</div>
  }

  return children
}

export default function Application() {
  return (
    <div className="spark-app-container">
      <SessionMonitor>
        <Outlet />
      </SessionMonitor>
    </div>
  )
}

import { Outlet } from "react-router-dom"
import { useSession } from "@/stores/auth"
import { ReactNode } from "react"
import { SparkContext } from "./components/SparkContext"
import { useSparkContext } from "@/stores/context"

const SessionMonitor = ({ children }: { children: ReactNode }): ReactNode => {
  const { isLoading } = useSession()

  if (isLoading) {
    return <div>Initial Load of Session</div>
  }

  return children
}

export default function Application() {
  const context = useSparkContext()
  const { session } = useSession()
  return (
    <div className="spark-app-container">
      <SessionMonitor>
        <SparkContext />
        <Outlet />
        {/* <pre>{JSON.stringify(context, null, 2)}</pre> */}
        {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
      </SessionMonitor>
    </div>
  )
}

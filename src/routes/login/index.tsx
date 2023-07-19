import { Navigate } from "react-router-dom"
import { useSession, useLogin } from "@/state/hooks"
import { useQueryParams } from "@/router/utils"
import { DaisyTheme } from "@/components/daisy/Theme"
import { toast } from "react-toastify"
import { FullScreenLayout } from "@/components/layouts/full-screen"
import { LoginForm } from "./components/LoginForm"
import { LoginCredentials } from "@/types"
import { ReactQueryErrorNotifications } from "@/components/ui/notifications/ReactQueryErrorNotifications"

export const Component = () => {
  const { isAuthenticated } = useSession()
  const login = useLogin()
  const queryParams = useQueryParams()

  if (isAuthenticated) {
    return <Navigate replace to="/" />
  }

  if (login.data?.user) {
    toast.dismiss()
    const path = queryParams.get("redirect") || "/"
    return <Navigate replace to={path} />
  }

  const onSubmit = (credentials: LoginCredentials) => {
    login.mutate(credentials)
  }

  return (
    <DaisyTheme theme="light">
      <ReactQueryErrorNotifications query={login} />
      <FullScreenLayout>
        <div className="flex min-h-full justify-center">
          <div className="card m-auto bg-base-300">
            <div className="card-body">
              <div className="card-title">Sign into your account</div>
              <LoginForm onSubmit={onSubmit} isSubmitting={login.isLoading} />
            </div>
          </div>
        </div>
      </FullScreenLayout>
    </DaisyTheme>
  )
}

export default Component

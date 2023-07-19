import { type LoginCredentials } from "@/types"
import { Navigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useSession, useLogin } from "@/state/hooks"
import { useQueryParams } from "@/router/utils"
import { DaisyTheme } from "@/components/daisy/Theme"
import { useEffect, MouseEvent } from "react"
import { toast } from "react-toastify"
import { AxiosError } from "axios"
import { extractErrorMessages } from "@/utils/react-query"

export const Component = () => {
  useEffect(() => {
    document.body.classList.add("h-full")
    document.getElementById("root")?.classList.add("h-full")
    document.documentElement.classList.add("h-full", "bg-white")

    return () => {
      document.body.classList.remove("h-full")
      document.documentElement.classList.remove("h-full", "bg-white")
      document.getElementById("root")?.classList.remove("h-full")
    }
  }, [])

  const { isAuthenticated } = useSession()
  const login = useLogin()
  const queryParams = useQueryParams()
  const { register, handleSubmit } = useForm<LoginCredentials>()

  if (isAuthenticated) {
    return <Navigate replace to="/" />
  }

  if (login.data?.user) {
    const path = queryParams.get("redirect") || "/"
    toast.dismiss()
    return <Navigate replace to={path} />
  }

  if (login.isError) {
    if (login.error instanceof AxiosError) {
      const errors = extractErrorMessages(login.error)
      errors.forEach((error, idx) => {
        const message = `${error.error}: ${error.message}`
        toast.error(message, {
          toastId: `auth.error.${idx}`,
        })
      })
    }
  }

  const onSubmit = handleSubmit((credentials: LoginCredentials) => {
    void login.mutate(credentials)
  })

  const startDevSession = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    void login.mutate({ email: "advisoradmin@ci.com", password: "password" })
  }

  return (
    <DaisyTheme theme="light">
      <div className="flex min-h-full justify-center">
        <div className="card m-auto bg-base-300">
          <div className="card-body">
            <div className="card-title">Sign into your account</div>

            <form data-test="login-form" onSubmit={(e) => void onSubmit(e)}>
              <div className="flex flex-col gap-6 justify-between">
                <div>
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    data-test="login-form-email"
                    className="w-full"
                    {...register("email", { required: true })}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password">Password</label>
                    <a href="#" className="link text-sm">
                      Forgot password?
                    </a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    data-test="login-form-password"
                    className="w-full"
                    {...register("email", { required: true })}
                  />
                </div>
                <div>
                  <button
                    disabled={login.isLoading}
                    className="btn btn-primary"
                  >
                    {login.isLoading ? "Logging You In" : "Login"}
                  </button>
                </div>
                <div className="flex flex-col card card-compact bg-base-100">
                  <div className="card-body">
                    <div className="font-bold">Dev Credentials:</div>
                    <div>Username: advisoradmin@spark.com</div>
                    <div>Password: password</div>
                    <button
                      type="button"
                      className="btn btn-accent glass btn-sm group"
                      onClick={startDevSession}
                      disabled={login.isLoading}
                    >
                      {login.isLoading ? "Logging You In" : "Login"}
                      <span className="opacity-0 group-hover:opacity-100 transition-all duration-200">
                        😎
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DaisyTheme>
  )
}

export default Component

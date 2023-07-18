import { type LoginCredentials } from "@/types"
import { Navigate } from "react-router-dom"
import { useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useSession, useLogin } from "@/state/hooks"
import { useQueryParams } from "@/router/utils"

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

  const submitHandler: SubmitHandler<LoginCredentials> = (
    credentials: LoginCredentials
  ) => {
    void login.mutate(credentials)
  }

  if (login.data?.user) {
    const path = queryParams.get("redirect") || "/"
    return <Navigate replace to={path} />
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value="advisoradmin@ci.com"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("email", { required: true })}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("password", { required: true })}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={login.isLoading}
                className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  login.isLoading ? "opacity-50" : ""
                }`}
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="#"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Start a 14 day free trial
            </a>
          </p>
        </div>
      </div>
    </>
  )
}

export default Component

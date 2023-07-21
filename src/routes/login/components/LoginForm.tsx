import { MouseEvent } from "react"
import { useForm } from "react-hook-form"
import { type LoginCredentials } from "@/types"

type Props = {
  onSubmit: (credentials: LoginCredentials) => void
  isSubmitting: boolean
}

export const LoginForm = ({ onSubmit, isSubmitting }: Props) => {
  const { register, handleSubmit } = useForm<LoginCredentials>()

  const onFormSubmit = handleSubmit((credentials: LoginCredentials) => {
    onSubmit(credentials)
  })

  const startDevSession = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onSubmit({ email: "advisoradmin@ci.com", password: "password" })
  }

  return (
    <form data-test="login-form" onSubmit={(e) => void onFormSubmit(e)}>
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
          <button disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? "Logging You In" : "Login"}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging You In" : "Login"}
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-200">
                😎
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

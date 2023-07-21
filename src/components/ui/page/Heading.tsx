import { ReactNode } from "react"

export const Heading = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={`ci-page-heading w-full p-2 font-bold ${
        className || "bg-base-100 text-base-content"
      }`}
    >
      <div className="spark-container flex flex-row justify-between">
        {children}
      </div>
    </div>
  )
}

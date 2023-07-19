import { ReactNode, useEffect } from "react"

export const FullScreenLayout = ({ children }: { children: ReactNode }) => {
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

  return children
}

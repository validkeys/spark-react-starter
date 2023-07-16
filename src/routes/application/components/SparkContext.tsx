import { useSparkContext } from "@/stores/context"
import { ReactNode } from "react"

export function SparkContext({ children }: { children?: ReactNode }) {
  useSparkContext()
  return <>{children || null}</>
}

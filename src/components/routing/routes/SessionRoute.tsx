import { ReactNode } from "react"
import ProtectedRoute from "./ProtectedRoute"
import UserRequiredData from "./UserRequiredData"

export default function SessionRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <UserRequiredData>{children}</UserRequiredData>
    </ProtectedRoute>
  )
}

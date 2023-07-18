import { ReactNode } from "react"
import { useSession } from "@/stores"
import { permitsDataAtom } from "@/stores/user"
import { useAtom } from "jotai"
import { Suspense } from "react"

const Loader = ({ children }: { children: ReactNode }) => {
  const { session } = useSession()
  useAtom(permitsDataAtom)

  if (!session.isAuthenticated) {
    return <>No Session Detected</>
  }

  return children
}

export default function UserRequiredData({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Suspense fallback={<div>Loading Required User Data</div>}>
      <Loader>{children}</Loader>
    </Suspense>
  )
}

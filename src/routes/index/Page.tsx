import { type Permit } from "@/types"
import { Navigate, Link } from "react-router-dom"
import { useCurrentUserPermits } from "@/stores/user"
import { Suspense } from "react"

const PermitTile = ({ permit }: { permit: Permit }) => {
  let path = "/"

  switch (permit.role?.type) {
    case 0:
      path = "/admin"
      break
    case 1:
      path = "/ops"
      break
    case 3:
      path = `/organizations/${permit.organizationId as string}/advisors/${
        permit.advisorId as string
      }`
      break
    default:
      path = "/"
      break
  }

  return (
    <Link to={path}>
      <div className="bg-white shadow rounded border border-solid border-black p-2 m-2">
        <div>Permit {permit.id}</div>
        <div>
          Role: {permit.role?.name} | {permit.role?.type}
        </div>
        {permit.organization ? (
          <div>Organization: {permit.organization.name}</div>
        ) : null}
        {permit.advisor ? <div>Advisor: {permit.advisor.name}</div> : null}
      </div>
    </Link>
  )
}

export default function IndexRoute() {
  // const currentUser = useCurrentUserValue() as User
  const permits = useCurrentUserPermits()

  if (permits?.length === 1) {
    const [permit] = permits

    if (permit.role?.type === 3) {
      const path = `/organizations/${permit.organizationId}/advisors/${permit.advisorId}`
      return <Navigate replace to={path} />
    }
  }

  return (
    <Suspense fallback={<div>Loading User Permits</div>}>
      <div>
        <div>Your Permits</div>
        {permits?.map((permit) => {
          return <PermitTile key={permit.id} permit={permit} />
        })}
      </div>
    </Suspense>
  )
}

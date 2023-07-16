import { useCurrentUserValue } from "@/stores/auth"
import { type Permit } from "@/types"
import { Navigate } from "react-router-dom"

const PermitTile = ({ permit }: { permit: Permit }) => {
  return (
    <div className="bg-white shadow rounded border border-solid border-black p-2 m-2">
      <div>Permit {permit.id}</div>
      <div>Role: {permit.role?.name}</div>
      {permit.organization ? (
        <div>Organization: {permit.organization.name}</div>
      ) : null}
      {permit.advisor ? <div>Advisor: {permit.advisor.name}</div> : null}
    </div>
  )
}

export default function IndexRoute() {
  const currentUser = useCurrentUserValue()

  if (!currentUser) {
    return <></>
  }

  if (currentUser.permits?.length === 1) {
    const [permit] = currentUser.permits

    if (permit.role?.type === 3) {
      const path = `/organizations/${permit.organizationId}/advisors/${permit.advisorId}`
      return <Navigate replace to={path} />
    }
  }

  return (
    <div>
      <div>Your Permits</div>
      {currentUser.permits?.map((permit) => {
        return <PermitTile key={permit.id} permit={permit} />
      })}
    </div>
  )
}

import { Permit } from "@/types"
import { Link } from "react-router-dom"
import { RoleTypes } from "@/mocks/helpers"
import get from "lodash.get"

type Props = {
  permit: Permit
}

const getPath = (permit: Permit) => {
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

  return path
}

const getTitle = (permit: Permit) => {
  if (!permit.role) {
    return ""
  }

  switch (permit.role.type) {
    case RoleTypes.SysAdmin:
      return "System Administrator"
      break
    case RoleTypes.Ops:
      return "Operations"
    case RoleTypes.Organization:
      return get(permit, "organization.name") as string
    case RoleTypes.Advisor:
      return get(permit, "advisor.name") as string
    case RoleTypes.Client:
      return get(permit, "client.name") as string
    default:
      return "Unknown"
  }
}

const getInitials = (permit: Permit) => {
  if (!permit.role) {
    return ""
  }
  if (permit.role.type === RoleTypes.SysAdmin) {
    return "SA"
  } else if (permit.role.type === RoleTypes.Ops) {
    return "OPS"
  } else {
    return (getTitle(permit) || "").substring(0, 2).toUpperCase()
  }
}

const getDetail = (permit: Permit) => {
  if (!permit.role) {
    return ""
  }
  const type = permit.role.type
  const title = getTitle(permit)
  switch (type) {
    case RoleTypes.SysAdmin:
      return "Administrate the Spark application"
    case RoleTypes.Ops:
      return "Manage custodial operations"
    case RoleTypes.Organization:
      return `Manage ${title} head office`
    case RoleTypes.Advisor:
      return "Manage your advisory and clients"
    case RoleTypes.Client:
      return `Manage ${title}`
    default:
      return ""
  }
}

const getColor = (permit: Permit) => {
  const type = permit.role ? permit.role.type : null
  switch (type) {
    case RoleTypes.SysAdmin:
      return "bg-black text-white"
    case RoleTypes.Ops:
      return "bg-green-500 text-white"
    case RoleTypes.Organization:
      return "bg-cyan-700 text-white"
    case RoleTypes.Advisor:
      return "bg-purple-800 text-white"
    case RoleTypes.Client:
      return "bg-orange-600 text-white"
    default:
      return "bg-gray-300 text-gray-800"
  }
}

export const PermitCard = ({ permit }: Props) => {
  return (
    <Link to={getPath(permit)}>
      <div className="card card-bordered card-side bg-base-300 card-compact overflow-hidden hover:shadow-xl hover:bg-base-200">
        <figure>
          <div className="avatar placeholder h-full w-24 overflow-hidden">
            <div className={getColor(permit)}>
              <span className="text-2xl">{getInitials(permit)}</span>
            </div>
          </div>
        </figure>
        <div className="card-body">
          <div className="card-title overflow-ellipsis">{getTitle(permit)}</div>
          {getDetail(permit)}
        </div>
      </div>
    </Link>
  )
}

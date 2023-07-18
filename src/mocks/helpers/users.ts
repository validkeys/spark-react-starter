import { db } from "../db"
import { createStandardRoles } from "./roles"
import { IModel } from "../types"

type User = IModel<"user">

export const createSysAdmin = <T extends User>(userRecord?: Partial<T>): T => {
  const roles = createStandardRoles()
  const user = userRecord ? userRecord : db.user.create()
  db.permit.create({
    userId: user.id,
    roleId: roles.sysAdmin.id,
    organizationId: null,
    advisorId: null,
    clientId: null,
  })
  return user as T
}

export const createOpsUser = <T extends User>(
  props: { admin: boolean },
  userRecord?: Partial<T>
): T => {
  const roles = createStandardRoles()
  const user = userRecord ? userRecord : db.user.create()
  db.permit.create({
    userId: user.id,
    roleId: props.admin ? roles.opsAdmin.id : roles.opsUser.id,
    organizationId: null,
    advisorId: null,
    clientId: null,
  })
  return user as T
}

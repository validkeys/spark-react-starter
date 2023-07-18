import { db } from "../db"

import { IModel } from "../types"

export enum RoleTypes {
  SysAdmin,
  Ops,
  Organization,
  Advisor,
  Client,
}

export interface StandardRoles<Role = any> {
  sysAdmin: Role
  opsAdmin: Role
  opsUser: Role
  orgAdmin: Role
  orgUser: Role
  advisorAdmin: Role
  advisorUser: Role
  clientAdmin: Role
  clientUser: Role
}

type RoleConfig = {
  name: string
  type: RoleTypes
  isAdmin: boolean
  key: keyof StandardRoles
}

// type BasicRole = Omit<RoleConfig, 'key'> & { id: string }

const STANDARD_ROLES: RoleConfig[] = [
  {
    key: "sysAdmin",
    name: "Sys Admin",
    type: RoleTypes.SysAdmin,
    isAdmin: true,
  },
  { key: "opsAdmin", name: "Ops Admin", type: RoleTypes.Ops, isAdmin: true },
  { key: "opsUser", name: "Ops User", type: RoleTypes.Ops, isAdmin: false },
  {
    key: "orgAdmin",
    name: "Organization Admin",
    type: RoleTypes.Organization,
    isAdmin: true,
  },
  {
    key: "orgUser",
    name: "Organization User",
    type: RoleTypes.Organization,
    isAdmin: false,
  },
  {
    key: "advisorAdmin",
    name: "Advisor Admin",
    type: RoleTypes.Advisor,
    isAdmin: true,
  },
  {
    key: "advisorUser",
    name: "Advisor User",
    type: RoleTypes.Advisor,
    isAdmin: false,
  },
  {
    key: "clientAdmin",
    name: "Client Admin",
    type: RoleTypes.Client,
    isAdmin: true,
  },
  {
    key: "clientUser",
    name: "Client User",
    type: RoleTypes.Client,
    isAdmin: false,
  },
]

export const createStandardRoles = <
  Role = IModel<"role">
>(): StandardRoles<Role> => {
  return STANDARD_ROLES.reduce((obj, roleConfig) => {
    let record = db.role.findFirst({
      where: {
        type: { equals: roleConfig.type },
        isAdmin: { equals: roleConfig.isAdmin },
      },
    })

    if (!record) {
      record = db.role.create(roleConfig)
    }

    return {
      ...obj,
      [roleConfig.key]: record,
    }
  }, {}) as StandardRoles<Role>
}

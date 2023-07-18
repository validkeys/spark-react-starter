import { db } from '../db'
import { createStandardRoles } from './roles'
import { IModel } from '../types'

type User = IModel<'user'>
type Advisor = IModel<'advisor'>
type Client = IModel<'client'>

export interface CreateAdvisor {
  organization: IModel<'organization'>
  advisor: Advisor
  admin: User
  user: User
}

export const createAdvisor = (
  advisorProps: Partial<Advisor> = {}
): CreateAdvisor => {
  const organization = advisorProps.organizationId
    ? db.organization.findFirst({
        where: { id: { equals: advisorProps.organizationId } }
      })
    : db.organization.create()

  if (!organization) {
    throw new Error('no organization in createAdvisor helper')
  }

  const advisor = db.advisor.create({
    ...advisorProps,
    organizationId: organization.id
  })
  const admin = createAdvisorAdmin(advisor)
  const user = createAdvisorUser(advisor)

  return { organization, advisor, admin, user }
}

export const createAdvisorAdmin = <T extends Advisor>(
  advisor: T,
  user?: any
): User => {
  const roles = createStandardRoles()
  const _user = user || db.user.create()
  db.permit.create({
    userId: _user.id,
    roleId: roles.advisorAdmin.id as string,
    organizationId: advisor.organizationId,
    advisorId: advisor.id,
    clientId: null
  })
  return _user
}

export const createAdvisorUser = <T extends Advisor>(
  advisor: T,
  user?: any
): User => {
  const roles = createStandardRoles()
  const _user = user || db.user.create()
  db.permit.create({
    userId: _user.id,
    roleId: roles.advisorUser.id as string,
    organizationId: advisor.organizationId,
    advisorId: advisor.id,
    clientId: null
  })
  return _user
}

export const createClientAdmin = <T extends Client>(
  advisor: IModel<'advisor'>,
  client: T,
  user?: any
): User => {
  const roles = createStandardRoles()
  const _user = user || db.user.create()
  db.permit.create({
    userId: _user.id,
    roleId: roles.clientAdmin.id as string,
    organizationId: advisor.organizationId,
    advisorId: advisor.id,
    clientId: client.id
  })
  return _user
}

export const createClientUser = <T extends Client>(
  advisor: IModel<'advisor'>,
  client: T,
  user?: any
): User => {
  const roles = createStandardRoles()
  if (!advisor) {
    throw new Error('no advisor found in createClientAdmin')
  }
  const _user = user || db.user.create()
  db.permit.create({
    userId: _user.id,
    roleId: roles.clientUser.id as string,
    organizationId: advisor.organizationId,
    advisorId: advisor.id,
    clientId: client.id
  })
  return _user
}

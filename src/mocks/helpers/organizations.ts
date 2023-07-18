import { db } from '../db';
import { createStandardRoles } from './roles';
import { IModel } from '../types';

export interface CreateOrganization {
  organization: IModel<'organization'>;
  admin: IModel<'user'>;
  user: IModel<'user'>;
}

export const createOrganization = (
  orgProps: object = {}
): CreateOrganization => {
  const organization = db.organization.create(orgProps);
  const admin = createOrgAdmin(organization);
  const user = createOrgUser(organization);

  return { organization, admin, user };
};

export const createOrgAdmin = <T extends { id: string }>(
  organization: T,
  user?: any
): IModel<'user'> => {
  const roles = createStandardRoles();
  const _user = user || db.user.create();
  db.permit.create({
    userId: _user.id,
    roleId: roles.orgAdmin.id as string,
    organizationId: organization.id,
    advisorId: null,
    clientId: null,
  });
  return _user;
};

export const createOrgUser = <T extends { id: string }>(
  organization: T,
  user?: any
): IModel<'user'> => {
  const roles = createStandardRoles();
  const _user = user || db.user.create();
  db.permit.create({
    userId: _user.id,
    roleId: roles.orgUser.id as string,
    organizationId: organization.id,
    advisorId: null,
    clientId: null,
  });
  return _user;
};

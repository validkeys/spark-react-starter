export interface User {
  id: number
  name: string
  permits?: Permit[]
}

export interface Advisor {
  id: string
  name: string
}

export interface Organization {
  id: string
  name: string
}

export interface Role {
  id: string
  isAdmin: boolean
  name: string
  type: number
}

export interface Permit {
  id: string
  advisor?: Advisor
  advisorId: string | null
  organization?: Organization
  organizationId: string | null
  userId: string
  user?: User
  roleId: string
  role?: Role
}

export interface OrganizationApiResponse {
  organization: Organization
}

export interface AdvisorApiResponse {
  advisor: Advisor
}

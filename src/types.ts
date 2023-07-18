export interface User {
  id: string
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

export interface Client {
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

export interface PermitApiResponse {
  permits: Permit[]
  advisor?: Advisor
  client?: Client
  organization?: Organization
}

export interface AdvisorApiResponse {
  advisor: Advisor
}

export type ApiError = {
  statusCode: number
  message: string
  error: string
}

export type ApiErrorResponse = { errors: ApiError[] }

export interface AuthenticatedResponse {
  user: User
  token: string
}

export interface MoneyMoveRequest {
  id: string
  amount: number
}

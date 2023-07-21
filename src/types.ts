export interface User {
  id: string
  name: string
  email: string
  permits?: Permit[]
}

export interface Advisor {
  id: string
  name: string
}

export interface Organization {
  id: string
  name: string
  logo: string
}

export interface Client {
  id: string
  name: string
  investmentSummary?: {
    marketValue: number
    currencyCode: string
  }
}

export interface Role {
  id: string
  isAdmin: boolean
  name: string
  type: number
}

export interface Permit {
  id: string
  client?: Client
  clientId: string | null
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
  type: "ToBank" | "FromBank" | "Internal"
  client?: Client
  bankAccountNumber: string
  financialAccountNumber: string
  bankInstitutionNumber: string
  method: string
  createdDate: Date
  currencyCode: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export type PaginationMeta = {
  total: number
  page: number
  limit: number
}

export type MoneyMoveResponse = {
  requests: MoneyMoveRequest[]
  meta: PaginationMeta
}

export type ClientSummary = {
  clientId: string
  advisorId: string
  organizationId: string
  branchId: string | null
  regionId: string | null
  clientName: string
  advisorName: string
}

export type ClientSearchResults = ClientSummary[]

export type DOMRectProps = Omit<DOMRectReadOnly, "toJSON">

export type OpsRequestBatchUpdatePayload = {
  ids: string[]
  action: "approve" | "reject"
}

export type ClientDetailResponse = {
  client: Client & {
    advisor: Advisor
  }
}

export type Currency = "cad" | "usd"

export type NavigationItem = {
  name: string
  href: string
  end?: boolean
}

import { LoginCredentials } from "@/stores"
import axios from "@/utils/fetch"
import {
  type AuthenticatedResponse,
  type OrganizationApiResponse,
  type AdvisorApiResponse,
  type PermitApiResponse,
} from "@/types"

export const getSession = async (): Promise<AuthenticatedResponse> => {
  const result = await axios.get<AuthenticatedResponse>("/api/v1/sessions")
  return result.data
}

export const postSession = async (credentials: LoginCredentials) => {
  const result = await axios.post<AuthenticatedResponse>(
    "/api/v1/sessions",
    credentials
  )
  return result.data
}

export const destroySession = async (): Promise<null> => {
  await axios.delete("/api/v1/sessions")
  return null
}

export const getOrganization = async (id: string) => {
  const result = await axios.get<OrganizationApiResponse>(
    `/api/v1/organizations/${id}`
  )
  return result.data
}

export const getOrganizationAdvisors = async (
  organizationId: string,
  advisorId: string
) => {
  const { data } = await axios.get<AdvisorApiResponse>(
    `/api/v1/organizations/${organizationId}/advisors/${advisorId}`
  )
  return data
}

export const getUserPermits = async (userId: string) => {
  const { data } = await axios.get<PermitApiResponse>(
    `/api/v1/users/${userId}/permits`
  )
  return data
}

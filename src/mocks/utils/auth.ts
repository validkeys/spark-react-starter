import decode from 'jwt-decode'
import encode from 'jwt-encode'
import { type RestRequest } from 'msw'

interface TokenData {
  id: any
}

export const createSessionToken = (user: object & { id: any }): string => {
  const tokenData: TokenData = { id: user.id }
  return encode(tokenData, 'secret')
}

export const readSessionToken = (token: string) => {
  return decode(token)
}

export const getSession = (req: RestRequest): TokenData | null => {
  const header =
    req.headers.get('authorization') || req.headers.get('Authorization')
  if (!header) {
    return null
  }

  const token = header.split('Bearer ')[1] as string
  return decode(token) as TokenData
}

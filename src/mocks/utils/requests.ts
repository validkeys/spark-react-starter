import { RestRequest } from 'msw'

export const hasQueryInclude = (req: RestRequest, key: string) => {
  const includes = req.url.searchParams.get('include')
  if (includes) {
    const models = includes.split(',')
    return models.includes(key)
  }

  return false
}

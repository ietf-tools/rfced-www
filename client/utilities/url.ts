import { parseRFCId } from '~/components/rfc'

export const API_RED_URL = 'http://localhost:8000/' // TODO: make this an environment variable

export const SEARCH_PATH = '/search/' as const

export const SEARCH_API_PATH = '/api/search/' as const

export const rfcPathBuilder = (rfc: string) => {
  const rfcParts = parseRFCId(rfc)

  return `/info/${rfcParts.type.toLowerCase()}${rfcParts.number}/`
}

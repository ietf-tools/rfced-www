import { parseRFCId } from '~/components/rfc'

export const SEARCH_PATH = '/search/' as const

export const SEARCH_API_PATH = '/api/search/' as const

export const rfcPathBuilder = (rfc: string) => {
  const rfcParts = parseRFCId(rfc)

  return `/info/${rfcParts.type.toLowerCase()}${rfcParts.number}/`
}

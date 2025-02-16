import type { Rfc } from '~/generated/red-client'
import { parseRFCId } from '~/utilities/rfc'

// FIXME: get from an environment variable
export const PRIVATE_API_URL = 'http://localhost:8000/'

export const PUBLIC_SITE = 'https://www.rfc-editor.org/'

export const SEARCH_PATH = '/search/' as const

export const SEARCH_API_PATH = '/api/search/' as const

export const RFC_INDEX_ALL_ASCENDING = '/rfc-index/' as const

export const RFC_INDEX_100_ASCENDING = '/rfc-index-100a/' as const

export const RFC_INDEX_ALL_DESCENDING = '/rfc-index2/' as const

export const RFC_INDEX_100_DESCENDING = '/rfc-index-100d/' as const

export const infoRfcPathBuilder = (rfcId: string) => {
  const rfcParts = parseRFCId(rfcId)

  return `/info/${rfcParts.type.toLowerCase()}${rfcParts.number}/`
}

export const rfcPathBuilder = (rfcId: string) => {
  const rfcParts = parseRFCId(rfcId)

  return `/rfc/${rfcParts.type.toLowerCase()}${rfcParts.number}/`
}

export const rfcCitePathBuilder = (
  rfcId: string,
  format: 'txt' | 'bibTeX' | 'xml'
): string => {
  const parsedRfcId = parseRFCId(rfcId)

  switch (format) {
    case 'txt':
      return `${PUBLIC_SITE}refs/${parsedRfcId.type.toLowerCase()}${parsedRfcId.number}.txt`
    case 'xml':
      return `https://bib.ietf.org/public/rfc/bibxml/reference.${parsedRfcId.type.toUpperCase()}.${parsedRfcId.number}.xml`
    case 'bibTeX':
      return `https://datatracker.ietf.org/doc/${parsedRfcId.type.toLowerCase()}${parsedRfcId.number}/bibtex/`
  }
}

export const rfcFormatPathBuilder = (rfcId: string, format: 'html'): string => {
  const parsedRfcId = parseRFCId(rfcId)

  switch (format) {
    case 'html':
      return `${PUBLIC_SITE}rfc/${parsedRfcId.type.toLowerCase()}${parsedRfcId.number}.html`
  }
}

export const rfcErrataPathBuilder = (rfcId: string): string => {
  const parsedRfcId = parseRFCId(rfcId)

  return `${PUBLIC_SITE}errata/${parsedRfcId.type.toLowerCase()}${parsedRfcId.number}/`
}

export const authorPathBuilder = (author: Rfc['authors'][number]): string => {
  return `mailto:${author.email}`
}

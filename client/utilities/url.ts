import { kebabCase } from 'lodash-es'
import type { Rfc } from '~/generated/red-client'
import type ContentMetadata from '~/generated/content-metadata.json'
import { parseRFCId } from '~/utilities/rfc'
import type { SearchParams } from '~/stores/search'

type MarkdownPaths = keyof typeof ContentMetadata

export const IETF_PRIVACY_STATEMENT_URL =
  'https://www.ietf.org/privacy-statement/'

// FIXME: get from an environment variable
export const PRIVATE_API_URL = 'http://localhost:8000/'

export const PUBLIC_SITE = 'https://www.rfc-editor.org'

export const SEARCH_PATH = '/search/' as const

export const SEARCH_API_PATH = '/api/search/' as const

type SearchKeys = keyof SearchParams

export const searchPathBuilder = (
  searchParams: Partial<SearchParams>
): string => {
  const hasParams = Object.values(searchParams).join('').trim().length > 0
  return `${SEARCH_PATH}${hasParams ? '?' : ''}${
    hasParams ?
      (Object.keys(searchParams) as SearchKeys[])
        .map((searchKey) => {
          const searchValue = searchParams[searchKey]
          return searchValue ? `${searchKey}=${searchValue}` : ''
        })
        .filter(Boolean)
        .join('&')
    : ''
  }`
}

export const RFC_INDEX_ALL_ASCENDING = '/rfc-index/' as const

export const RFC_INDEX_100_ASCENDING = '/rfc-index-100a/' as const

export const RFC_INDEX_ALL_DESCENDING = '/rfc-index2/' as const

export const RFC_INDEX_100_DESCENDING = '/rfc-index-100d/' as const

export const refsRefTxtPathBuilder = (rfcId: string) => {
  const rfcParts = parseRFCId(rfcId)

  return `/refs/ref${rfcParts.number}.txt`
}

export const infoRfcPathBuilder = (rfcId: string) => {
  const rfcParts = parseRFCId(rfcId)

  return `/info/${rfcParts.type.toLowerCase()}${rfcParts.number}/`
}

export const rfcJSONPathBuilder = (rfcId: string) => {
  const rfcParts = parseRFCId(rfcId)

  return `/api/v1/rfc${rfcParts.number}.json`
}

export const markdownPathBuilder = (markdownPath: MarkdownPaths) => markdownPath

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
      return `${PUBLIC_SITE}/refs/${parsedRfcId.type.toLowerCase()}${parsedRfcId.number}.txt`
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
      return `${PUBLIC_SITE}/rfc/${parsedRfcId.type.toLowerCase()}${parsedRfcId.number}.html`
  }
}

export const authorPathBuilder = (author: Rfc['authors'][number]): string => {
  return `mailto:${author.email}`
}

export const isInternalLink = (href: string): boolean => {
  return href.startsWith('/')
}

export const textToAnchorId = (text: string) => {
  const normalized = text
    .trim()
    .toLowerCase() // lowercase before kebabCase() because otherwise kebabCase() will split 'RFCs' into 'rf-cs'
    .replace(/[^0-9a-zA-Z\s]/g, '') // removes eg question marks
  if (
    // if it's an empty string then getVNodeText() probably returned an empty string, so just return `undefined`
    !normalized
  ) {
    return
  }

  return kebabCase(normalized)
}

import { kebabCase } from 'lodash-es'
import type { Rfc } from '../generated/red-client'
import { parseRFCId } from '../utilities/rfc'
import type { SearchParams } from '~/stores/search'

export type ValidHrefs =
  | MarkdownValidHrefs // generated global type from types/markdown-valid-hrefs.d.ts
  | `https://${string}` // any external link is treated as valid (even if it might 404 we don't verify further)
  | typeof HOME_PATH
  | typeof RFC_INDEX_ALL_ASCENDING_PATH
  | typeof RFC_INDEX_100_ASCENDING_PATH
  | typeof RFC_INDEX_ALL_DESCENDING_PATH
  | typeof RFC_INDEX_100_DESCENDING_PATH
  | typeof RSS_PATH
  | typeof ATOM_PATH
  | typeof STANDARDS_PATH
  | typeof IN_NOTES_BCP_REF_TXT
  | typeof IN_NOTES_RFC_REF_TXT
  | typeof IN_NOTES_STD_REF_TXT
  | typeof QUEUE_XML_PATH
  | typeof QUEUE_2_XML_PATH
  | typeof REPORTS_CURRENT_QUEUE_STATS_TXT_PATH
  | ReturnType<typeof markdownPathBuilder>
  | ReturnType<typeof searchPathBuilder>
  | ReturnType<typeof authorMailtoBuilder>
  | ReturnType<typeof refsRefTxtPathBuilder>
  | ReturnType<typeof infoRfcPathBuilder>
  | ReturnType<typeof rfcJSONPathBuilder>
  | ReturnType<typeof rfcPathBuilder>
  | ReturnType<typeof materialsTxtBuilder>
  | ReturnType<typeof rfcFormatPathBuilder>
  | ReturnType<typeof rfcCitePathBuilder>
  | ReturnType<typeof wikiDokuBuilder>

export const HOME_PATH = '/'

export const IETF_PRIVACY_STATEMENT_URL =
  'https://www.ietf.org/privacy-statement/'
export const PUBLIC_SITE = 'https://www.rfc-editor.org'
export const DATATRACKER_URL = 'https://datatracker.ietf.org/'
export const IETF_URL = 'https://www.ietf.org/'
export const IRTF_URL = 'https://www.irtf.org/'
export const IAB_URL = 'https://www.iab.org/'
export const INTERNET_SOCIETY_URL = 'https://www.internetsociety.org/'

export const SEARCH_PATH = '/search/'
export const SEARCH_API_PATH = '/api/search/'

export const RFC_INDEX_ALL_ASCENDING_PATH = '/rfc-index/'
export const RFC_INDEX_100_ASCENDING_PATH = '/rfc-index-100a/'
export const RFC_INDEX_ALL_DESCENDING_PATH = '/rfc-index2/'
export const RFC_INDEX_100_DESCENDING_PATH = '/rfc-index-100d/'
export const REPORTS_CURRENT_QUEUE_STATS_TXT_PATH = '/reports/CurrQstats.txt'

export const STANDARDS_PATH = '/standards/'

export const RSS_PATH = '/rfcrss.xml'
export const ATOM_PATH = '/rfcatom.xml'

export const IN_NOTES_BCP_REF_TXT = '/in-notes/bcp-ref.txt'
export const IN_NOTES_RFC_REF_TXT = '/in-notes/rfc-ref.txt'
export const IN_NOTES_STD_REF_TXT = '/in-notes/std-ref.txt'

export const QUEUE_XML_PATH = '/queue.xml'
export const QUEUE_2_XML_PATH = '/queue2.xml'

type SearchKeys = keyof SearchParams

export const searchPathBuilder = (
  searchParams: Partial<SearchParams>
): `${typeof SEARCH_PATH}${string}` => {
  const hasParams = Object.values(searchParams).join('').trim().length > 0
  return `${SEARCH_PATH}${hasParams ? '?' : ''}${
    hasParams ?
      (Object.keys(searchParams) as SearchKeys[])
        .sort() // normalize order
        .map((searchKey) => {
          const searchValue = searchParams[searchKey]
          return searchValue ? `${searchKey}=${searchValue}` : ''
        })
        .filter(Boolean)
        .join('&')
    : ''
  }`
}

export const refsRefTxtPathBuilder = (
  rfcId: string
): `/refs/ref${string}.txt` => {
  const rfcParts = parseRFCId(rfcId)

  return `/refs/ref${rfcParts.number}.txt` as const
}

export const infoRfcPathBuilder = (
  rfcId: string
): `/info/${string}${string}/` => {
  const rfcParts = parseRFCId(rfcId)

  return `/info/${rfcParts.type.toLowerCase()}${rfcParts.number}/` as const
}

export const rfcJSONPathBuilder = (
  rfcId: string
): `/api/v1/rfc/rfc${string}.json` => {
  const rfcParts = parseRFCId(rfcId)

  return `/api/v1/rfc/rfc${rfcParts.number}.json` as const
}

/**
 * This is only used for TS to check valid markdown paths.
 * It's just an identity function.
 */
export const markdownPathBuilder = (markdownPath: MarkdownValidHrefs) =>
  markdownPath

export const rfcPathBuilder = (
  rfcId: string,
  sectionHash?: `section-${string}`
) => {
  const rfcParts = parseRFCId(rfcId)

  return `/rfc/${rfcParts.type.toLowerCase()}${rfcParts.number}/${sectionHash ? (`#${sectionHash}` as const) : ''}` as const
}

export const materialsTxtBuilder = (txtFile: `${string}.txt`) => {
  return `/materials/${txtFile}` as const
}

export const rfcCitePathBuilder = (
  rfcId: string,
  format: 'txt' | 'bibTeX' | 'xml'
) => {
  const parsedRfcId = parseRFCId(rfcId)

  switch (format) {
    case 'txt':
      return `/refs/${parsedRfcId.type.toLowerCase()}${parsedRfcId.number}.txt` as const
    case 'xml':
      return `https://bib.ietf.org/public/rfc/bibxml/reference.${parsedRfcId.type.toUpperCase()}.${parsedRfcId.number}.xml` as const
    case 'bibTeX':
      return `https://datatracker.ietf.org/doc/${parsedRfcId.type.toLowerCase()}${parsedRfcId.number}/bibtex/` as const
  }
}

export const rfcFormatPathBuilder = (rfcId: string, format: 'html') => {
  const parsedRfcId = parseRFCId(rfcId)

  switch (format) {
    case 'html':
      return `/rfc/${parsedRfcId.type.toLowerCase()}${parsedRfcId.number}.html` as const
  }
}

export const authorMailtoBuilder = (author: Rfc['authors'][number]) => {
  return `mailto:${author.email}` as const
}

export const wikiDokuBuilder = (wikiPath: string) => {
  return `/rpc/wiki/doku.php?id=${wikiPath}` as const
}

const mailtoRegex = /^mailto:/
export const isMailToLink = (href?: string): boolean => {
  return mailtoRegex.test(href ?? '')
}

const httpRegex = /^https?:\/\//
export const isExternalLink = (href?: string): boolean => {
  if (
    href === undefined
    // although this scenario isn't an external link we shouldn't treat it as a Vue Router link so we'll call it external
  ) {
    return true
  }
  return httpRegex.test(href ?? '')
}

export const isInternalLink = (href?: string): boolean => !isExternalLink(href)

export const isHashLink = (href?: string): boolean => !!href?.startsWith('#')

/**
 * Converts arbitrary text into a custom id that is DOMId compliant (ie no whitespace)
 *
 * WARNING: this does not ensure unique DOM ids. It's not a uuid/useId hook. It just derives
 * an id from the input string.
 */
export const textToAnchorId = (text: string): string | undefined => {
  const normalized = text
    .trim()
    .toLowerCase() // lowercase before kebabCase() because otherwise kebabCase() will split 'RFCs' into 'rf-cs'
    .replace(/\./g, '-') // replace periods because otherwise "section 2.2" becomes "section22" rather than "section2-2" which is more readable in the url
    .replace(/[^0-9\-a-zA-Z\s]/g, '') // removes non-alphanumeric eg question marks
  if (
    // if it's an empty string then getVNodeText() probably returned an empty string, so just return `undefined`
    !normalized
  ) {
    return
  }

  return kebabCase(normalized)
}

/**
 * Based on the URL of the API detect whether it's prod
 */
export const isProdApi = (apiBaseUrl: string): boolean =>
  !apiBaseUrl.includes('localhost')

export const parseMaybeRfcLink = (
  href?: string
): undefined | ReturnType<typeof parseRFCId> => {
  if (!href) return undefined
  const rfcMatch = href.match(/(rfc[0-9]+)/i)
  if (!rfcMatch) return undefined
  return parseRFCId(rfcMatch[0])
}

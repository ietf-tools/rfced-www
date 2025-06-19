import { DateTime } from 'luxon'
import type { Rfc } from '../generated/red-client'
import { NONBREAKING_SPACE } from './strings'
import { infoRfcPathBuilder, PUBLIC_SITE } from './url'
import { FIXME_getRFCWithMissingData } from './rfc.mocks'
import { formatAuthor, formatIdentifiers } from './rfc-converters-utils'

export type RfcCommon = {
  number: number
  title: string
  published: string
  status:
    | 'Internet Standard'
    | 'Proposed Standard'
    | 'Draft Standard'
    | 'Best Current Practice'
    | 'Informational'
    | 'Experimental'
    | 'Historic'
    | 'Unknown'
    | 'Not Issued'
  pages?: number | null
  authors: {
    person: number
    name: string
    email?: string
    affiliation?: string
    country?: string
  }[]
  group: {
    acronym: string
    name: string
  }
  area?: {
    acronym: string
    name: string
  }
  stream: {
    slug: string
    name: string
    desc?: string
  }
  identifiers?: {
    type: 'doi' | 'issn'
    value: string
  }[]
  obsoletes?: {
    id: number
    number: number
    title: string
  }[]
  obsoleted_by?: {
    id: number
    number: number
    title: string
  }[]
  updates?: {
    id: number
    number: number
    title: string
  }[]
  updated_by?: {
    id: number
    number: number
    title: string
  }[]
  is_also?: string[]
  see_also?: string[]
  draft?: {
    id?: number
    name: string
    title: string
  }
  abstract?: string
  formats: ('xml' | 'txt' | 'html' | 'htmlized' | 'pdf' | 'ps')[]
  keywords?: string[]
  errata?: string[]
  text: string | null
}

export const blankRfcCommon: RfcCommon = {
  number: 0,
  title: '',
  published: '1950-1-1',
  status: 'Unknown',
  pages: 0,
  authors: [],
  group: {
    acronym: '',
    name: ''
  },
  area: {
    acronym: '',
    name: ''
  },
  stream: {
    slug: '',
    name: '',
    desc: ''
  },
  identifiers: [],
  obsoleted_by: [],
  updated_by: [],
  formats: [],
  abstract: '',
  text: ''
}

type RFCId = {
  type: string | typeof RFC_TYPE_RFC
  number: string
  title?: string
}

export const RFC_TYPE_RFC = 'RFC'

export const parseRFCId = (title: string): RFCId => {
  // split by groups of letters or numbers
  // ie "RFC0000" becomes ["RFC", "0000"]
  // or "RFC0000BUB" becomes ["RFC", "0000", "BUB"]
  const parts = title
    .replace(
      // remove whitespace including non-breaking-space
      /\s/g,
      ''
    )
    .match(/\d+|\D+/g)

  if (parts?.length === 2) {
    return {
      type: parts[0].toUpperCase(),
      number: parseInt(parts[1], 10).toString()
    }
  }

  if (parts?.length === 3) {
    return {
      type: parts[0].toUpperCase(),
      number: parseInt(parts[1], 10).toString(),
      title: parts[2]
    }
  }

  return {
    type: 'unknown',
    number: title
  }
}

/**
 * Formats a string of 'RFCnumber' with non-bold/bold text with an NBSP between
 * Returns h() Component for rendering
 */
export const formatTitleAsVNode = (rfcId: string) => {
  const parts = parseRFCId(rfcId)

  return h('span', [
    h('span', { class: 'font-normal' }, parts.type),
    NONBREAKING_SPACE,
    h('span', { class: 'font-bold' }, parts.number)
  ])
}

/**
 * Renders RFC summary txt. Eg.
 *
 * Crocker, S., "Host Software", RFC 1, DOI 10.17487/RFC0001, April 1969, <https://www.rfc-editor.org/info/rfc1>.
 *
 * As used on https://www.rfc-editor.org/refs/ref0001.txt
 */
export const refsRefRfcIdTxt = (rfc: Rfc): string => {
  const rfcWithMissingData = FIXME_getRFCWithMissingData(rfc)
  return `${rfcWithMissingData.authors.map((author) => formatAuthor(author, 'brief'))}, "${rfcWithMissingData.title}", RFC ${rfcWithMissingData.number}, ${formatIdentifiers(rfcWithMissingData.identifiers, ' ').join('')}, ${DateTime.fromISO(rfcWithMissingData.published).toFormat('LLLL yyyy')}, <${PUBLIC_SITE}${infoRfcPathBuilder(`rfc${rfcWithMissingData.number}`)}>.\n`
}

export type RFCJSON = {
  draft: string
  doc_id: string
  title: string
  authors: string[]
  format: string[]
  page_count: string
  pub_status: string
  status: string
  source: string
  abstract?: string
  pub_date: string
  keywords: string[]
  obsoletes: string[]
  obsoleted_by: string[]
  updates: string[]
  updated_by: string[]
  see_also: string[]
  doi: string | null
  errata_url: string | null
}

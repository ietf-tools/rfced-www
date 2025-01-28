import type { RfcMetadata, Rfc } from '../generated/red-client'
import { NONBREAKING_SPACE } from './strings'

const cache: Record<string, Rfc> = {}

export const rfcMetadataToRfc = (rfcMetadata: RfcMetadata): Rfc => {
  const rfcId = parseRFCId(`rfc${rfcMetadata.number}`)
  const cacheId = `${rfcId.type}${rfcId.number}`
  if (!cache[cacheId]) {
    cache[cacheId] = {
      ...blankRfc,
      number: rfcMetadata.number,
      abstract: rfcMetadata.abstract,
      published: rfcMetadata.published,
      status: rfcMetadata.status,
      pages: rfcMetadata.pages,
      authors: rfcMetadata.authors,
      group: rfcMetadata.group,
      area: rfcMetadata.area,
      stream: rfcMetadata.stream,
      identifiers: rfcMetadata.identifiers,
      obsoleted_by: rfcMetadata.obsoleted_by,
      updated_by: rfcMetadata.updated_by,
      title: rfcMetadata.title
    }
  }
  return cache[cacheId]
}

export const blankRfc: Rfc = {
  number: 0,
  title: '',
  published: '1950-1-1',
  status: {
    slug: 'unknown',
    name: 'Unknown'
  },
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
      number: parts[1]
    }
  }

  if (parts?.length === 3) {
    return {
      type: parts[0].toUpperCase(),
      number: parts[1],
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
export const formatTitle = (rfcId: string) => {
  const parts = parseRFCId(rfcId)

  return h('span', [
    h('span', { class: 'font-normal' }, parts.type),
    NONBREAKING_SPACE,
    h('span', { class: 'font-bold' }, parts.number)
  ])
}

/**
 * Formats a string of 'RFCnumber' as plain text with an NBSP between
 */
export const formatTitlePlaintext = (title: string) => {
  const parts = parseRFCId(title)

  return `${parts.type}${NONBREAKING_SPACE}${parts.number}`
}

type Author = RfcMetadata['authors'][number]

/**
 * Formats author names into an initialised format, eg.
 * author.name:
 * * "First Name" becomes "F. Name"
 * * "First Second Name" becomes "F.S. Name"
 * ...and if they're an editor they get an "Ed." suffix
 */
export const formatAuthor = (author: Author): string => {
  const name = author.name
    .split(/[\s.]/g)
    .filter(Boolean)
    .reduce((acc, item, index, arr) => {
      return `${acc}${
        index === arr.length - 1 ?
          ` ${item}`
        : `${item.substring(0, 1).toUpperCase()}.`
      }`
    }, '')

  return author.affiliation === 'Editor' ? `${name}, Ed.` : name
}

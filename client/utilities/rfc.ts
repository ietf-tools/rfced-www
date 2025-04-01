import { DateTime } from 'luxon'
import { range } from 'lodash-es'
import type { RfcMetadata, Rfc } from '../generated/red-client'
import { NONBREAKING_SPACE } from './strings'
import { infoRfcPathBuilder, PUBLIC_SITE } from './url'
import { FIXME_getRFCWithMissingData } from './rfc.mocks'

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

const parseRfcFormat = (format: string): Rfc['formats'][number] => {
  switch (format.toLowerCase()) {
    case 'xml':
      return 'xml'
    case 'ascii':
      return 'txt'
    case 'txt':
      return 'txt'
    case 'html':
      return 'html'
    case 'htmlized':
      return 'htmlized'
    case 'pdf':
      return 'pdf'
    case 'ps':
      return 'ps'
  }
  throw Error(`Unable to parse RFC format "${format}"`)
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

type UppercaseFormats = Uppercase<Rfc['formats'][number]> | 'ASCII'

export const formatFormat = (
  format: string,
  isPreV3: boolean // we need to know whether it's pre-V3 https://www.rfc-editor.org/rpc/wiki/doku.php?id=rfc_metadata_in_the_v3_era
): UppercaseFormats => {
  switch (format) {
    case 'txt':
      return isPreV3 ? 'ASCII' : 'TXT'
    case 'xml':
      return 'XML'
    case 'html':
      return 'HTML'
    case 'htmlized':
      return 'HTMLIZED'
    case 'pdf':
      return 'PDF'
    case 'ps':
      return 'PS'
  }
  throw Error(`Unexpected format "${format}"`)
}

type Author = RfcMetadata['authors'][number]

/**
 * Formats author names into an initialised format.
 *
 * , eg.
 * author.name:
 * * "First Name" becomes "F. Name"
 * * "First Second Name" becomes "F.S. Name"
 * ...and if they're an editor they get an "Ed." suffix
 *
 */
export const formatAuthor = (
  author: Author,
  style: 'regular' | 'brief' | 'reverse'
): string => {
  const name = author.name
    .split(/[\s.]/g)
    .filter(Boolean)
    .filter((_part, index, arr) => {
      if (style === 'regular') {
        return true
      }

      // if style === 'brief' then discard middlenames
      return index === 0 || index === arr.length - 1
    })
    .reduce((acc, item, index, arr) => {
      if (style === 'regular') {
        const newBit =
          index === arr.length - 1 ?
            ` ${item}`
          : `${item.substring(0, 1).toUpperCase()}.`
        return `${acc}${newBit}`
      }

      if (style === 'brief') {
        const newBit =
          index === arr.length - 1 ?
            `${item}, `
          : `${item.substring(0, 1).toUpperCase()}.`
        return `${newBit}${acc}`
      }

      if (style === 'reverse') {
        const newBit =
          index === arr.length - 1 ?
            `${item}, `
          : `${item.substring(0, 1).toUpperCase()}.`
        return `${newBit}${acc}`
      }

      return acc
    }, '')

  return author.affiliation === 'Editor' ? `${name}, Ed.` : name
}

export const formatIdentifiers = (
  identifiers: RfcMetadata['identifiers'],
  separator: string = ': '
): string[] => {
  if (!identifiers || identifiers.length === 0) return []
  return identifiers.map(
    (identifier) =>
      `${identifier.type.toUpperCase()}${separator}${identifier.value}`
  )
}

export const parseRfcJsonPubDateToISO = (
  pub_date: RFCJSON['pub_date']
): string => {
  const parts = pub_date.split(/\s/g)
  let day: number = 0
  let month: number = 0
  let year: number = 0
  let dateISO: ReturnType<ReturnType<typeof DateTime.fromObject>['toISO']> =
    null

  if (parts.length === 3) {
    // April first
    day = parseInt(parts[0], 10)
    month = parseMonthName(parts[1])
    year = parseInt(parts[2], 10)
    dateISO = DateTime.fromObject({ day, year, month }).toISO()
  } else if (parts.length === 2) {
    month = parseMonthName(parts[0])
    year = parseInt(parts[1], 10)
    dateISO = DateTime.fromObject({ year, month }).toISO()
  }

  if (!dateISO) {
    throw Error(`Unable to parse date "${pub_date}"`)
  }
  return dateISO
}

/**
 * Returns 1-based index from month name
 */
const parseMonthName = (monthName: string) => {
  const monthsNames = range(1, 12).map((monthNumber) =>
    DateTime.fromObject({
      year: 2025,
      month: monthNumber
    }).toFormat('LLL')
  )
  for (let i = 0; i < monthsNames.length; i++) {
    const monthsNameItem = monthsNames[i]
    if (
      monthName.substring(0, monthsNameItem.length).toLowerCase() ===
      monthsNameItem.toLowerCase()
    ) {
      return i + 1 // 1-based index
    }
  }
  throw Error(`Unexpected monthName "${monthName}"`)
}

export const formatDatePublished = (
  dt: DateTime,
  isAprilFirstMode: boolean
): string => {
  if (isAprilFirstMode && dt.month === 4 && dt.day === 1) {
    // handle April 1st
    return dt.toFormat('d LLLL yyyy')
  }
  return dt.toFormat('LLLL yyyy')
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

/**
 * Converts between types of RFC data
 */
export const rfcToRfcJSON = (rfc: Rfc): RFCJSON => {
  const date = DateTime.fromISO(rfc.published)

  return {
    draft: rfc.draft?.name ?? '',
    doc_id: `RFC${rfc.number}`,
    title: rfc.title,
    authors: rfc.authors.map((author) => formatAuthor(author, 'regular')) ?? [],
    format: rfc.formats.map((format) =>
      formatFormat(
        format,
        // FIXME: get info on whether it's a pre-V3 rfc.... or ensure API will return ASCII
        true
      )
    ),
    page_count: rfc.pages?.toString() ?? '0',
    pub_status: rfc.status.name.toUpperCase(),
    status: rfc.status.name.toUpperCase(),
    source: rfc.stream.name,
    abstract: rfc.abstract,
    pub_date: formatDatePublished(date, false),
    keywords: rfc.keywords ?? [],
    obsoletes: rfc.obsoletes?.map((obsolete) => `RFC${obsolete.number}`) ?? [],
    obsoleted_by:
      rfc.obsoleted_by?.map((obsoleted_by) => `RFC${obsoleted_by.number}`) ??
      [],
    updates: rfc.updates?.map((update) => `RFC${update.number}`) ?? [],
    updated_by:
      rfc.updated_by?.map(
        (updated_by_item) => `RFC${updated_by_item.number}`
      ) ?? [],
    see_also: rfc.see_also ?? [],
    doi:
      rfc.identifiers?.find((identifier) => identifier.type === 'doi')?.value ??
      null,
    errata_url: rfc.errata?.[0] ?? null
  }
}

/**
 * Converts between types of RFC data
 */
export const rfcJSONToRfc = (rfcJson: RFCJSON): Rfc => {
  return {
    number: parseInt(parseRFCId(rfcJson.doc_id).number, 10),
    title: rfcJson.title,
    published: parseRfcJsonPubDateToISO(rfcJson.pub_date),
    status: {
      slug: 'standard', // FIXME: can we derive into "bcp" | "experimental" | "historic" | "informational" | "not-issued" | "standard" | "unknown"
      name: rfcJson.status
    },
    pages: parseInt(rfcJson.page_count, 10),
    authors: rfcJson.authors.map((authorName) => ({
      person: 0,
      name: authorName
    })),
    group: {
      acronym: rfcJson.source,
      name: rfcJson.source
    },
    area: undefined,
    stream: {
      slug: rfcJson.source,
      name: rfcJson.source
    },
    identifiers:
      rfcJson.doi ?
        [
          {
            type: 'doi',
            value: rfcJson.doi
          }
        ]
      : [],
    obsoletes: rfcJson.obsoletes.map(
      (obsolete): NonNullable<Rfc['obsoletes']>[number] => {
        const rfcId = parseRFCId(obsolete)
        return {
          id: 0,
          number: parseInt(rfcId.number, 10),
          title: obsolete
        }
      }
    ),
    obsoleted_by: rfcJson.obsoleted_by.map(
      (obsoleted_by_item): NonNullable<Rfc['obsoleted_by']>[number] => {
        const rfcId = parseRFCId(obsoleted_by_item)
        return {
          id: 0,
          number: parseInt(rfcId.number, 10),
          title: obsoleted_by_item
        }
      }
    ),
    updates: rfcJson.updates.map(
      (update): NonNullable<Rfc['updates']>[number] => {
        const rfcId = parseRFCId(update)
        return {
          id: 0,
          number: parseInt(rfcId.number, 10),
          title: update
        }
      }
    ),
    updated_by: rfcJson.updated_by.map(
      (updated_by_item): NonNullable<Rfc['updated_by']>[number] => {
        const rfcId = parseRFCId(updated_by_item)
        return {
          id: 0,
          number: parseInt(rfcId.number, 10),
          title: updated_by_item
        }
      }
    ),
    is_also: undefined,
    see_also: rfcJson.see_also,
    draft: {
      id: 0,
      name: rfcJson.draft,
      title: rfcJson.draft
    },
    abstract: rfcJson.abstract,
    formats: rfcJson.format.map(parseRfcFormat),
    keywords: rfcJson.keywords,
    errata: [],
    text: ''
  }
}

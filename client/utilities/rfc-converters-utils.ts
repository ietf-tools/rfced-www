import { range } from 'lodash-es'
import { DateTime } from 'luxon'
import type { z } from 'zod'
import { parseRFCId } from './rfc'
import type { RfcCommon, RFCJSON } from './rfc'
import { NONBREAKING_SPACE } from './strings'
import { assertIsString, assertNever } from './typescript'
import type { HintedString } from './typescript'
import type { TypeSenseSearchItemSchema } from './typesense'
import type { Rfc, RfcMetadata } from '~/generated/red-client'
import type { RfcEditorToc } from './tableOfContents'

type RfcMetadataAuthor = RfcMetadata['authors'][number]

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
  author: RfcMetadataAuthor,
  style: 'regular' | 'brief' | 'reverse'
): string => {
  const name = author.name
    .split(/[\s.]/g)
    .filter(Boolean)
    .filter((_part, index, arr) => {
      if (style === 'regular') {
        return true
      }
      // otherwise discard middlenames
      const isStart = index === 0
      const isEnd = index === arr.length - 1
      return isStart || isEnd
    })
    .reduce((acc, item, index, arr) => {
      let newBit = ''
      switch (style) {
        case 'regular':
          newBit =
            index === arr.length - 1 ?
              ` ${item}`
            : `${item.substring(0, 1).toUpperCase()}.`
          return `${acc}${newBit}`
        case 'brief':
          newBit =
            index === arr.length - 1 ?
              `${item}, `
            : `${item.substring(0, 1).toUpperCase()}.`
          return `${newBit}${acc}`
        case 'reverse':
          newBit =
            index === arr.length - 1 ?
              `${item}, `
            : `${item.substring(0, 1).toUpperCase()}.`
          return `${newBit}${acc}`
      }
      assertNever(style)
    }, '')

  return author.affiliation === 'Editor' ? `${name}, Ed.` : name
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
  const monthsNames = range(1, 13).map((monthNumber) =>
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

export const parseRfcFormat = (
  format: string
): RfcCommon['formats'][number] => {
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
 * Formats a string of 'RFCnumber' as plain text with an NBSP between
 */
export const formatTitlePlaintext = (title: string) => {
  const parts = parseRFCId(title)

  return `${parts.type}${NONBREAKING_SPACE}${parts.number}`
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

export const parseRfcStatusSlug = (
  rfcStatusSlug: HintedString<RfcMetadata['status']['slug']> | undefined
): RfcCommon['status'] => {
  const normalisedSlug = rfcStatusSlug?.toLowerCase().replace(/[^a-z]/g, '')

  switch (normalisedSlug) {
    case 'bestcurrentpractice':
    case 'bcp':
      return 'Best Current Practice'

    case 'experimental':
      return 'Experimental'

    case 'his':
    case 'historic':
      return 'Historic'

    case 'fyi':
    case 'informational':
      return 'Informational'

    case 'notissued':
      return 'Not Issued'

    case 'internetstandard':
    case 'standard':
    case 'std':
      return 'Internet Standard'

    case 'unknown':
      return 'Unknown'

    case 'proposedstandard':
    case 'proposed':
      return 'Proposed Standard'

    case 'draftstandard':
    case 'draft':
      return 'Draft Standard'
  }
  throw Error(
    `Unable to parse status slug "${rfcStatusSlug}" (normalized as "${normalisedSlug}")`
  )
}

export const parseTypeSenseSubseries = (
  item: z.infer<typeof TypeSenseSearchItemSchema>
): RfcCommon['subseries'] => {
  switch (item.status?.name) {
    case 'Best Current Practice':
      if (item.subseries?.bcp) {
        assertIsString(item.subseries?.bcp)
        return {
          type: 'bcp',
          number: parseFloat(item.subseries?.bcp),
          subseriesLength: item.subseries?.total
        }
      }
      break
    case 'Informational':
      if (item.subseries?.fyi) {
        assertIsString(item.subseries?.fyi)
        return {
          type: 'fyi',
          number: parseFloat(item.subseries?.fyi),
          subseriesLength: item.subseries?.total
        }
      }
      break
    case 'Internet Standard':
      if (item.subseries?.std) {
        assertIsString(item.subseries?.std)
        return {
          type: 'std',
          number: parseFloat(item.subseries?.std),
          subseriesLength: item.subseries?.total
        }
      }
      break
  }
  return undefined
}

type TocSection = RfcEditorToc['sections'][number]
export const isTocSection = (
  maybeTocSection?: TocSection
): maybeTocSection is TocSection => {
  return Boolean(
    maybeTocSection &&
      typeof maybeTocSection === 'object' &&
      'links' in maybeTocSection
  )
}

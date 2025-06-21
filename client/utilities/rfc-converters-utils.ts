import { range } from 'lodash-es'
import { DateTime } from 'luxon'
import { z } from 'zod'
import { parseRFCId } from './rfc'
import type { RfcCommon, RFCJSON } from './rfc'
import { NONBREAKING_SPACE } from './strings'
import { assertIsString, assertNever } from './typescript'
import type { HintedString } from './typescript'
import type { Rfc, RfcMetadata } from '~/generated/red-client'

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
  switch (rfcStatusSlug) {
    case 'Best Current Practice':
    case 'bcp':
      return 'Best Current Practice'

    case 'Experimental':
    case 'experimental':
      return 'Experimental'

    case 'Historic':
    case 'historic':
      return 'Historic'

    case 'Informational':
    case 'informational':
      return 'Informational'

    case 'Not Issued':
    case 'not-issued':
      return 'Not Issued'

    case 'Internet Standard':
    case 'standard':
      return 'Internet Standard'

    case 'Unknown':
    case 'unknown':
      return 'Unknown'

    case 'Proposed Standard':
    case 'proposed-standard':
    case 'proposed':
      return 'Proposed Standard'

    case 'Draft Standard':
    case 'draft-standard':
    case 'draft':
      return 'Draft Standard'
  }
  throw Error(`Unable to parse status slug "${rfcStatusSlug}"`)
}

// Schema definition https://github.com/ietf-tools/search/blob/main/schemas/docs.md
export const TypeSenseSearchItemSchema = z.object({
  abstract: z.string(),
  adName: z.string().optional(),
  area: z
    .object({
      acronym: z.string(),
      name: z.string(),
      full: z.string()
    })
    .optional(),
  authors: z
    .array(
      z.object({
        name: z.string(),
        affiliation: z.string()
      })
    )
    .optional(),
  bcp: z.string().optional(),
  date: z.number(),
  filename: z.string(),
  flags: z
    .object({
      obsoleted: z.boolean(),
      updated: z.boolean()
    })
    .optional(),
  fyi: z.string().optional(),
  group: z.object({
    acronym: z.string(),
    name: z.string(),
    full: z.string()
  }),
  id: z.string(),
  keywords: z.array(z.string()),
  pages: z.number(),
  publicationDate: z.number(),
  ranking: z.number(),
  rfc: z.string(),
  rfcNumber: z.number(),
  state: z.array(z.string()),
  std: z.string().optional(),
  stdlevelname: z
    .enum([
      'Internet Standard',
      'Proposed Standard',
      'Draft Standard',
      'Best Current Practice',
      'Informational',
      'Experimental',
      'Historic',
      'Unknown'
    ])
    .optional(),
  stream: z.string(),
  subserieTotal: z.number().optional(),
  title: z.string(),
  type: z.string()
})

export const parseTypeSenseSubseries = (
  item: z.infer<typeof TypeSenseSearchItemSchema>
): RfcCommon['subseries'] => {
  switch (item.stdlevelname) {
    case 'Best Current Practice':
      assertIsString(item.bcp)
      return {
        type: 'bcp',
        number: parseFloat(item.bcp),
        subseriesLength: item.subserieTotal
      }
    case 'Informational':
      assertIsString(item.fyi)
      return {
        type: 'fyi',
        number: parseFloat(item.fyi),
        subseriesLength: item.subserieTotal
      }
    case 'Internet Standard':
      assertIsString(item.std)
      return {
        type: 'std',
        number: parseFloat(item.std),
        subseriesLength: item.subserieTotal
      }
  }
  return undefined
}

import { DateTime } from 'luxon'
import { padStart } from 'lodash-es'
import { splitWordsAt } from './strings'
import type { ApiClient, RfcMetadata } from '~/generated/red-client'

/**
 * Developer note: this file can't be named 'rfc-index.txt.ts' or else vitest can't import it
 */

const COLUMN_PADDING = 1

type DocListArg = Parameters<ApiClient['red']['docList']>[0]

// Incrementally pushes (streams) RFC results
export async function renderRfcIndexDotTxt(
  push: (data: string) => void,
  close: () => void,
  abortController: AbortController,
  redApi: ApiClient,
  delayBetweenRequestsMs: number
) {
  push(getHeader())

  const docListArg: DocListArg = {}

  // extract latest RFC to find largest RFC number for layout reasons.
  // the layout reasons are the two columns in the response, and the first
  // column might need more width if the RFC numbers are wider.
  // ie 4 digit RFC requires 5 chars wide, whereas 5 digit RFC requires 6
  // chars. The 'longest RFC number length' will need to be calculated.
  docListArg.sort = ['-number'] // sort by largest RFC number
  docListArg.limit = 1 // we only need one result

  const response = await redApi.red.docList(docListArg)

  if (response.results.length !== 1) {
    throw Error('Unable to retrieve single response of largest RFC number')
  }
  const biggestRfcNumber = response.results[0].number
  const longestRfcNumberLength = Math.max(
    4, // test suite may have a client that returns fewer, so we want 4 as the minimum
    biggestRfcNumber.toString().length
  )

  const column1Width = longestRfcNumberLength + COLUMN_PADDING
  const column2width = 68

  // array of whitespace chars where the index = number of spaces
  const whitespace = new Array(column1Width + 1)
    .fill('')
    .map((_, index) => ' '.repeat(index))

  docListArg.sort = ['number'] // sort by earliest RFC number
  docListArg.limit = 50 // load results in chunks of 50
  const resultsPerPage = docListArg.limit

  const layout: Layout = { longestRfcNumberLength }

  for (let page = 0; page < biggestRfcNumber / resultsPerPage; page++) {
    docListArg.offset = page * resultsPerPage
    const response = await redApi.red.docList(docListArg)

    if (abortController.signal.aborted) {
      close()
      return
    }

    // wait between requests so as not to overwhelm the server
    await setTimeoutPromise(delayBetweenRequestsMs)

    if (abortController.signal.aborted) {
      close()
      return
    }

    push('\n\n')
    push(
      response.results
        .map((result) => {
          const rfcText = stringifyRFC(result, layout)
          const rfcLines = splitWordsAt(rfcText, column2width)

          return [
            // No RFC prefix on these results
            padStart(result.number.toString(), longestRfcNumberLength, '0'),
            whitespace[column1Width - longestRfcNumberLength],
            rfcLines.join(`\n${whitespace[column1Width]}`)
          ].join('')
        })
        .join(' \n\n')
    )
  }

  close()
}

const setTimeoutPromise = (timerMs: number) =>
  new Promise((resolve) => setTimeout(resolve, timerMs))

const stringifyIdentifiers = (
  identifiers: RfcMetadata['identifiers']
): string => {
  if (!identifiers) return ''
  // FIXME: when TS is fixed we should be able to delete the following line
  const identifiersArr =
    Array.isArray(identifiers) ? identifiers : (
      ([identifiers] as unknown as Array<
        NonNullable<RfcMetadata['identifiers']>
      >)
    )

  if (identifiersArr.length === 0) return ''

  return ` ${identifiersArr
    .map(
      (identifier) => `(${identifier.type.toUpperCase()}: ${identifier.value})`
    )
    .join(' ')}`
}

const stringifyAuthor = (author: RfcMetadata['authors'][number]): string => {
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

type ExtraFieldNeededFormat =
  | {
      type: 'TXT'
    }
  | { type: 'HTML' }
  | { type: 'HTMLized' }
  | { type: 'PDF' }
  | { type: 'PS' }

type ExtraFieldNeededObsolete = {
  number: number
}

type ExtraFieldNeededUpdate = {
  number: number
}

type ExtraFieldNeededIsAlso = {
  number: number
}

type ExtraFieldNeededSeeAlso = {
  number: number
}

type ExtraFieldsNeeded = {
  formats: ExtraFieldNeededFormat[]
  obsoletes: ExtraFieldNeededObsolete[]
  updates: ExtraFieldNeededUpdate[]
  is_also: ExtraFieldNeededIsAlso[]
  see_also: ExtraFieldNeededSeeAlso[]
}

const missingData: Record<number, Partial<RfcMetadata & ExtraFieldsNeeded>> = {
  1: {
    authors: [
      {
        name: 'Steve Crocker',
        person: 0
      }
    ],
    formats: [{ type: 'TXT' }, { type: 'HTML' }]
  },
  2: {
    authors: [{ name: 'Bill Duvall', person: 0 }],
    formats: [{ type: 'TXT' }, { type: 'PDF' }, { type: 'HTML' }]
  },
  3: {
    authors: [{ name: 'Steve D. Crocker', person: 0 }],
    formats: [{ type: 'TXT' }, { type: 'HTML' }]
  },
  4: {
    authors: [{ name: 'E. B. Shapiro', person: 0 }],
    formats: [{ type: 'TXT' }, { type: 'HTML' }]
  },
  5: {
    authors: [{ name: 'J. Rulifson', person: 0 }],
    formats: [{ type: 'TXT' }, { type: 'HTML' }]
  },
  6: {
    authors: [{ name: 'S.D. Crocker.', person: 0 }],
    formats: [{ type: 'TXT' }, { type: 'HTML' }]
  },
  7: {
    authors: [{ name: 'G. Deloche', person: 0 }],
    formats: [{ type: 'TXT' }, { type: 'HTML' }]
  },
  8: {
    authors: [{ name: 'G. Deloche', person: 0 }],
    formats: [{ type: 'PDF' }]
  },
  9: {
    authors: [{ name: 'G. Deloche', person: 0 }],
    formats: [{ type: 'PDF' }]
  },
  10: {
    authors: [{ name: 'S.D. Crocker.', person: 0 }],
    formats: [{ type: 'TXT' }, { type: 'HTML' }],
    obsoletes: [{ number: 3 }],
    updated_by: [
      { id: 24, number: 24, title: '?' },
      { id: 27, number: 27, title: '?' },
      { id: 30, number: 30, title: '?' }
    ]
  },
  11: {
    authors: [{ name: 'G. Deloche', person: 0 }],
    formats: [{ type: 'TXT' }, { type: 'PDF' }, { type: 'HTML' }]
  },
  12: {
    authors: [{ name: 'M. Wingfield', person: 0 }],
    formats: [
      { type: 'TXT' },
      { type: 'PS' },
      { type: 'PDF' },
      { type: 'HTML' }
    ]
  },
  13: {
    authors: [{ name: 'Vincent Cerf', person: 0 }],
    formats: [{ type: 'TXT' }, { type: 'HTML' }]
  }
}

const formatRfcNumber = (number: number, layout: Layout): string => {
  return `RFC${padStart(number.toString(), layout.longestRfcNumberLength, '0')}`
}

type Layout = {
  longestRfcNumberLength: number
}

const stringifyRFC = (
  rfcMetadata: RfcMetadata & Partial<ExtraFieldsNeeded>,
  layout: Layout
): string => {
  // Based on https://github.com/rfc-editor/rpcwebsite/blob/edf4896c1d97fdd79a78ee6145e3a0c5ffb11fb9/rfc-ed/bin/rfc2txt.py#L97
  let obsups = ''
  let rfcdate = ''
  let rfcformat = ''
  let also = ''
  let doi = ''

  const missingRfc = missingData[rfcMetadata.number]

  const rfc: RfcMetadata & Partial<ExtraFieldsNeeded> = {
    ...missingRfc,
    ...rfcMetadata,
    authors: [...toArray(missingRfc?.authors), ...toArray(rfcMetadata?.authors)]
  }

  if (rfc.title === 'Not Issued') {
    return 'Not Issued.'
  } else {
    rfcdate = DateTime.fromISO(rfc.published).toFormat('LLLL yyyy')
    rfcformat =
      rfc.formats && rfc.formats.length > 0 ?
        `Format: ${rfc.formats.map((format) => format.type).join(', ')}`
      : ''

    if (rfc.obsoletes && rfc.obsoletes.length > 0) {
      obsups += ` (Obsoletes ${rfc.obsoletes
        .map((item) => formatRfcNumber(item.number, layout))
        .join(', ')})`
    }

    if (rfc.obsoleted_by && rfc.obsoleted_by.length > 0) {
      obsups += ` (Obsoleted by ${rfc.obsoleted_by
        .map((item) => formatRfcNumber(item.number, layout))
        .join(', ')})`
    }
    if (rfc.updates && rfc.updates.length > 0) {
      obsups += ` (Updates ${rfc.updates
        .map((item) => formatRfcNumber(item.number, layout))
        .join(', ')})`
    }
    if (rfc.updated_by && rfc.updated_by.length > 0) {
      obsups += ` (Updated by ${rfc.updated_by
        .map((item) => formatRfcNumber(item.number, layout))
        .join(', ')})`
    }

    const alsolist = [
      ...(rfc.is_also && rfc.is_also.length > 0 ?
        rfc.is_also.map((item) => formatRfcNumber(item.number, layout))
      : []),
      ...(rfc.see_also && rfc.see_also.length > 0 ?
        rfc.see_also.map((item) => formatRfcNumber(item.number, layout))
      : [])
    ]
    if (alsolist.length > 0) {
      also = ` (Also ${alsolist.join(', ')})`
    }

    doi = stringifyIdentifiers(rfc.identifiers)
    return `${rfc.title}. ${rfc.authors.map(stringifyAuthor).join(', ')}. ${rfcdate}. (${rfcformat})${obsups}${also} (Status: ${rfc.status.name.toUpperCase()})${doi}`
  }
}

const getHeader = (): string => {
  const date = new Date()
  const createdOn = `${padStart((date.getMonth() + 1).toString(), 2, '0')}/${padStart(date.getDate().toString(), 2, '0')}/${date.getFullYear()}` // note the backwards US month/day/year format

  return `

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

                             RFC INDEX
                           -------------

(CREATED ON: ${createdOn}.)

This file contains citations for all RFCs in numeric order.

RFC citations appear in this format:

  ####  Title of RFC.  Author 1, Author 2, Author 3.  Issue date.
        (Format: ASCII) (Obsoletes xxx) (Obsoleted by xxx) (Updates xxx)
        (Updated by xxx) (Also FYI ####) (Status: ssssss) (DOI: ddd)

or

  ####  Not Issued.

For example:

  1129 Internet Time Synchronization: The Network Time Protocol. D.L.
       Mills. October 1989. (Format: TXT, PS, PDF, HTML) (Also RFC1119) 
       (Status: INFORMATIONAL) (DOI: 10.17487/RFC1129) 

Key to citations:

#### is the RFC number.

Following the RFC number are the title, the author(s), and the
publication date of the RFC.  Each of these is terminated by a period.

Following the number are the title (terminated with a period), the
author, or list of authors (terminated with a period), and the date
(terminated with a period).

The format follows in parentheses. One or more of the following formats 
are listed:  text (TXT), PostScript (PS), Portable Document Format 
(PDF), HTML, XML.

Obsoletes xxxx refers to other RFCs that this one replaces;
Obsoleted by xxxx refers to RFCs that have replaced this one.
Updates xxxx refers to other RFCs that this one merely updates (but
does not replace); Updated by xxxx refers to RFCs that have updated
(but not replaced) this one.  Generally, only immediately succeeding
and/or preceding RFCs are indicated, not the entire history of each
related earlier or later RFC in a related series.

The (Also FYI ##) or (Also STD ##) or (Also BCP ##) phrase gives the
equivalent FYI, STD, or BCP number if the RFC is also in those
document sub-series.  The Status field gives the document's
current status (see RFC 2026).  The (DOI ddd) field gives the
Digital Object Identifier.

RFCs may be obtained in a number of ways, using HTTP, FTP, or email.
See the RFC Editor Web page http://www.rfc-editor.org

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

                                RFC INDEX
                                ---------

`
}

const toArray = (obj: unknown) => {
  if (!obj) return []
  return Array.isArray(obj) ? obj : [obj]
}

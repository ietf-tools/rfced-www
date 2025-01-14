import { DateTime } from 'luxon'
import { ApiClient, RfcMetadata } from '~/generated/red-client'
import { PRIVATE_API_URL } from '~/utilities/url'
import { padStart } from 'lodash-es'
import { splitWordsAt } from '~/utilities/strings'

/**
 * Redirect from the old URL of /search/rfc_search.php
 * to the new path of /search/
 * while translating all the params (that's the hard bit..see adjacent tests)
 */
export default defineEventHandler(async (event) => {
  const abortController = new AbortController()

  const stream = new ReadableStream({
    start(controller) {
      const push = (data: string): void => {
        if (abortController.signal.aborted) {
          // ignore
          return
        }
        controller.enqueue(data)
      }
      const close = () => {
        controller.close()
      }

      push(getHeader())

      appendResults(push, close, abortController)
    },
    // cleanup when the connection is terminated
    cancel() {
      console.log('closing stream...')
      abortController.abort()
    }
  })

  return sendStream(event, stream)
})

const getHeader = (): string => {
  const date = DateTime.utc()
  const createdOn = date.toFormat(
    'MM/dd/yyyy' // note the backwards US month/day/year format
  )
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

const COLUMN_PADDING = 1
const DELAY_BETWEEN_REQUESTS_MS = 1000

const appendResults = async (
  push: (data: string) => void,
  close: () => void,
  abortController: AbortController
) => {
  const redApi = new ApiClient({ baseUrl: PRIVATE_API_URL })
  type DocListArg = Parameters<(typeof redApi)['red']['docList']>[0]
  const docListArg: DocListArg = {}

  // extract latest RFC to find largest RFC number for layout reasons.
  // the layout reasons are the two columns in the response, and the first
  // column might need more width if the RFC numbers are wider.
  // ie 4 digit RFC requires 5 chars wide, whereas 5 digit RFC requires 6
  // chars. The 'longest RFC number length' will need to be calculated.
  docListArg.sort = ['-number'] // sort by largest RFC number
  docListArg.limit = 250
  const response = await redApi.red.docList(docListArg)
  const biggestRfcNumber = response.results[0].number
  const longestRfcNumberLength = biggestRfcNumber.toString().length
  const resultsPerPage = response.results.length
  const tabLength = longestRfcNumberLength + COLUMN_PADDING
  const lineBreakAtChars = 80

  // array of whitespace chars where the index = number of spaces
  const whitespace = new Array(tabLength + 1)
    .fill('')
    .map((_, index) => ' '.repeat(index))

  docListArg.sort = ['number'] // sort by earliest RFC number

  for (let page = 0; page < biggestRfcNumber / resultsPerPage; page++) {
    docListArg.offset = page * resultsPerPage

    const response = await redApi.red.docList(docListArg)

    if (abortController.signal.aborted) {
      close()
      return
    }

    // wait between requests so as not to overwhelm the server
    await setTimeoutPromise(DELAY_BETWEEN_REQUESTS_MS)

    if (abortController.signal.aborted) {
      close()
      return
    }

    push('\n\n')
    push(
      response.results
        .map((result) => {
          return [
            padStart(result.number.toString(), longestRfcNumberLength, '0'),
            whitespace[tabLength - longestRfcNumberLength],
            splitWordsAt(stringifyRFC(result), lineBreakAtChars).join(
              `\n${whitespace[tabLength]}`
            )
          ].join('')
        })
        .join('\n\n')
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
    .split(/\s/g)
    .map((part, index, arr) =>
      index < arr.length - 1 ?
        `${part.substring(0, 1).toUpperCase()}.`
      : ` ${part}`
    )
    .join(' ')

  return author.affiliation === 'Editor' ? `${name}, Ed.` : name
}

const stringifyRFC = (rfc: RfcMetadata): string => {
  // Based on https://github.com/rfc-editor/rpcwebsite/blob/edf4896c1d97fdd79a78ee6145e3a0c5ffb11fb9/rfc-ed/bin/rfc2txt.py#L97
  let obsups = ''
  let rfcdate = ''
  let rfcformat = ''
  let also = ''
  let doi = ''
  if (rfc.title === 'Not Issued') {
    return `${rfc.number} Not Issued.`
  } else {
    rfcdate = rfc.published
    // rfcformat = rfc.format.join(', ');

    // if ( rfc.obsoletes) obsups += ` (Obsoletes ${rfc.obsoletes.join(', ')})`;
    if (rfc.obsoleted_by && rfc.obsoleted_by.length > 0) {
      obsups += ` (Obsoleted by ${rfc.obsoleted_by.map((item) => `RFC${item.number}`).join(', ')})`
    }
    // if (rfc.updates) obsups += ` (Updates ${rfc.updates.join(', ')})`;
    // if (rfc.updated_by) obsups += ` (Updated by ${rfc.updated_by.map(item => `RFC${item.number}`).join(', ')})`;

    // const alsolist = [...(rfc.is_also || []), ...(rfc.see_also || [])];
    // if (alsolist.length > 0) also = ` (Also ${alsolist.join(', ')})`;

    doi = stringifyIdentifiers(rfc.identifiers)
    return `${rfc.title}. ${rfc.authors.map(stringifyAuthor).join(', ')}, ${rfcdate}. (${rfcformat})${obsups}${also} (Status: ${rfc.status.name.toUpperCase()})${doi}`
  }
}

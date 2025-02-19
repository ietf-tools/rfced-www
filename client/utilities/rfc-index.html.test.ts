import path from 'node:path'
import fs from 'node:fs'
import { renderToString } from 'vue/server-renderer'
import { vi, describe, beforeEach, afterEach, test, expect } from 'vitest'
import { XMLBuilder } from 'fast-xml-parser'
import { isVNode } from 'vue'
import { rfcToRfcIndexRow, rfcCommaList } from './rfc-index-html'
import { getRedClient, getRFCs } from './redClientWrappers'
import { infoRfcPathBuilder } from './url'
import {
  blankRfcResponse,
  twoDigitOldestRfcResponse,
  twoDigitRFCDocListResponse,
  type DocListResponse
} from './rfc.test'
import { parseRFCId } from './rfc'
import { parseHtml } from './html'
import type {
  ApiClient,
  PaginatedRfcMetadataList
} from '~/generated/red-client'

test('rfcCommaList', () => {
  const result = rfcCommaList([{ number: 1 }, { number: 2 }])
  expect(result).toHaveLength(3)
  expect(isVNode(result[0])).toBeTruthy()
  expect(result[1]).toBe(' , ')
  expect(isVNode(result[2])).toBeTruthy()
})

describe('rfcToRfcIndexRow for /rfc-index/', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  test('rfcToRfcIndexRow', async () => {
    const apiClient = getTestApiClient({
      oldestRfcResponse: twoDigitOldestRfcResponse,
      seekingResponses: [twoDigitRFCDocListResponse]
    })
    const rfcs = await getRFCs({ apiClient, sort: 'ascending' })
    const rfcSummariesAsVNodes = rfcs.map(
      // This is the thing we're testing
      rfcToRfcIndexRow
    )
    const rfcSummariesWithExtraHTML = await Promise.all(
      rfcSummariesAsVNodes.map((rfcSummaryAsVNode) =>
        // Returns HTML that looks like
        //   <span><!--[-->S. Crocker<!--]--> [ April 1969 ] (TXT, HTML)<!--[--><!--]--> (Status: unknown) (Stream: Legacy)(doi: 10.17487/RFC0001)</span>"
        renderToString(rfcSummaryAsVNode.information, {})
      )
    )
    const rfcSummaries = rfcSummariesWithExtraHTML.map(
      (rfcSummaryWithExtraHTML) =>
        rfcSummaryWithExtraHTML
          .replace(/<!--[\s\S]*?-->/g, '')
          .replace(/^<span>/i, '')
          .replace(/<\/span>$/i, '')
    )

    rfcSummaries.forEach((rfcSummary, index) => {
      const originalRfcSummary = originalRfcSummaries[index][1]
      expect(rfcSummary).toBe(originalRfcSummary)
    })
  })
})

const originalRfcIndexHtml = fs
  .readFileSync(path.join(import.meta.dirname, 'rfc-index.html'), 'utf-8')
  .toString()

const originalRfcIndex = parseHtml(originalRfcIndexHtml)

type XMLBuilderOptions = NonNullable<
  ConstructorParameters<typeof XMLBuilder>[0]
>

const xmlBuilderOptions: XMLBuilderOptions = {
  preserveOrder: true,
  ignoreAttributes: true,
  attributeNamePrefix: '',
  format: true,
  suppressBooleanAttributes: true,
  indentBy: '  '
}

const extractRfcSummaries = (document: unknown) => {
  if (!Array.isArray(document)) {
    console.log('Bad param document', document)
    throw Error('Bad param document')
  }
  const root = document[0]['html']
  const body = root[1]['body']
  const tables = body.filter((row: { table?: unknown }) => Boolean(row.table))
  const rfcsTable = tables[2]
  const rows = rfcsTable.table
  if (!Array.isArray(rows)) {
    console.log('Bad param rows', rows)
    throw Error('Bad param rows')
  }
  const builder = new XMLBuilder(xmlBuilderOptions)
  const htmlRows = rows.map((row: { tr: { td: unknown }[] }) => {
    /** Everyone knows you shouldn't use regex for HTML
     *
     *  ...unless it's a very specific structure which this is
     *  (ie, we're not dealing with arbitrary HTML so this is safe)
     */

    const numCell = row.tr[0]
    const numWithScripts: string = builder.build(numCell.td)

    const num = numWithScripts
      .replace(
        /<script[\s\S]*?<\/script>/gi,
        // we don't need any scripts because in our HTML there's always a companion <noscript>
        ''
      )
      .replace(/<noscript>(.*?)<\/noscript>/gi, (_match, rfcNumber) => {
        /**
           The HTML looks like this:

             <script type="text/javascript"> doStandardDocLink(&apos;RFC9280&apos;); </script>
             <noscript>9280</noscript>

           which is converted to:

           <a href="/info/rfc9280/">RFC9280</a>
        */
        return `<a href="${infoRfcPathBuilder(`RFC${parseInt(rfcNumber, 10)}`)}">${parseInt(rfcNumber, 10)}</a>`
      })
      .replace(/[\s]+/g, ' ') // normalise the whitespace
      .trim()

    const informationCell = row.tr[1]
    const informationWithScripts: string = builder.build(informationCell.td)
    const information = informationWithScripts
      .replace(
        /<script[\s\S]*?<\/script>/gi,
        // we don't need any scripts because in our HTML there's always a companion <noscript>
        ''
      )
      .replace(/<noscript>(.*?)<\/noscript>/gi, (_match, rfcId) => {
        /**
           The HTML looks like this:

             <script type="text/javascript"> doStandardDocLink(&apos;RFC9280&apos;); </script>
             <noscript>RFC9280</noscript>

           which is converted to:

           <a href="/info/rfc9280/">RFC9280</a>
        */
        return `<a href="${infoRfcPathBuilder(rfcId)}">RFC${parseRFCId(rfcId).number}</a>`
      })
      .replace(/[\s]+/g, ' ') // normalise the whitespace
      .trim()

    return [num, information]
  })

  // Remove the first row of the table because it's headings
  htmlRows.shift()

  return htmlRows
}

const originalRfcSummaries = extractRfcSummaries(originalRfcIndex)

type TestHelperResponses = {
  oldestRfcResponse: DocListResponse
  seekingResponses: PaginatedRfcMetadataList[]
}

const getTestApiClient = (responses: TestHelperResponses) => {
  const redApiMock = getRedClient()
  type DocListArg = Parameters<ApiClient['red']['docList']>[0]

  // clone so that we don't mutate original array
  const seekingResponses = [...responses.seekingResponses]

  redApiMock.red.docList = (search: DocListArg) =>
    new Promise((resolve) => {
      if (search.sort?.length === 1 && search.sort[0] === '-number') {
        resolve(responses.oldestRfcResponse)
        return
      }
      const nextSeek = seekingResponses.pop()
      if (!nextSeek) {
        resolve(blankRfcResponse)
        return
      }
      resolve(nextSeek)
    })

  return redApiMock
}

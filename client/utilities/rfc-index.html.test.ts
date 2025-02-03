import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest'
import fs from 'node:fs'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import { rfcToRfcSummary } from './rfc-index-html'
import { getAllRFCs } from './redClientWrappers'
import { PRIVATE_API_URL, rfcPathBuilder } from './url'
import {
  blankRfcResponse,
  twoDigitOldestRfcResponse,
  twoDigitRFCDocListResponse,
  type DocListResponse
} from './rfc.test'
import {
  ApiClient,
  type PaginatedRfcMetadataList
} from '~/generated/red-client'
import path from 'node:path'
import {} from 'vue'
import { renderToString } from 'vue/server-renderer'
import { parseRFCId } from './rfc'

const originalRfcIndexHtml = fs
  .readFileSync(path.join(import.meta.dirname, 'rfc-index.html'), 'utf-8')
  .toString()

const parseHtml = (html: string) => {
  const parser = new XMLParser({
    preserveOrder: true,
    ignoreAttributes: false,
    unpairedTags: ['hr', 'br', 'link', 'meta'],
    stopNodes: ['*.pre', '*.script'],
    processEntities: true,
    htmlEntities: true
  })
  return parser.parse(html)
}

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
  const tables = body.filter((row: { table?: any }) => Boolean(row.table))
  const rfcsTable = tables[2]
  const rows = rfcsTable.table
  if (!Array.isArray(rows)) {
    console.log('Bad param rows', rows)
    throw Error('Bad param rows')
  }
  const builder = new XMLBuilder(xmlBuilderOptions)
  const htmlRows = rows.map((row: any) => {
    /** Don't use regex for HTML...unless it's a very specific structure which this is
        (ie, we're not dealing with arbitrary HTML so this is safe)
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

             <script> doStandardDocLink(&apos;RFC9280&apos;); </script>
             <noscript>9280</noscript>

           which is converted to:

           <a href="/info/rfc9280/">RFC9280</a>
        */
        return `<a href="${rfcPathBuilder(`RFC${rfcNumber}`)}">${parseInt(rfcNumber, 10)}</a>`
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

             <script> doStandardDocLink(&apos;RFC9280&apos;); </script>
             <noscript>RFC9280</noscript>

           which is converted to:

           <a href="/info/rfc9280/">RFC9280</a>
        */
        return `<a href="${rfcPathBuilder(rfcId)}">RFC${parseRFCId(rfcId).number}</a>`
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
  const redApiMock = new ApiClient({ baseUrl: PRIVATE_API_URL })
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

describe('renderRfcIndexDotTxt', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  it('original rfc-index.html rendering', async () => {
    const apiClient = getTestApiClient({
      oldestRfcResponse: twoDigitOldestRfcResponse,
      seekingResponses: [twoDigitRFCDocListResponse]
    })
    const rfcs = await getAllRFCs(apiClient)
    const rfcSummariesAsVNodes = rfcs.map(rfcToRfcSummary)
    const rfcSummariesWithExtraHTML = await Promise.all(
      rfcSummariesAsVNodes.map((rfcSummaryAsVNode) =>
        // Returns HTML that looks like
        //   <span><!--[-->S. Crocker<!--]--> [ April 1969 ] (TXT, HTML)<!--[--><!--]--> (Status: unknown) (Stream: Legacy)(doi: 10.17487/RFC0001)</span>"
        renderToString(rfcSummaryAsVNode.body, {})
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

import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest'
import fs from 'node:fs'
import { XMLParser } from 'fast-xml-parser'
import { rfcToRfcSummary } from './rfc-index-html'
import { getAllRFCs } from './redClientWrappers'
import { PRIVATE_API_URL } from './url'
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

console.log(originalRfcIndex)

const extractRfcSummaries = (html: unknown) => {
  return []
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
    const rfcSummaries = rfcs.map(rfcToRfcSummary)

    rfcSummaries.forEach((rfcSummary, index) => {
      const originalRfcSummary = originalRfcSummaries[index]
      expect(rfcSummary).toBe(originalRfcSummary)
    })
  })
})

// @vitest-environment nuxt
import fs from 'node:fs'
import path from 'node:path'
import { vi, describe, beforeEach, afterEach, test, expect } from 'vitest'
import { splitLinesAt, renderRfcIndexDotTxt } from './rfc-index-txt'
import {
  ApiClient,
  type PaginatedRfcMetadataList
} from '~/generated/red-client'
import {
  twoDigitOldestRfcResponse,
  twoDigitRFCDocListResponse,
  type DocListResponse
} from './rfc.test'
import { PRIVATE_API_URL } from './url'

const paragraph =
  'Obsoletes xxxx refers to other RFCs that this one replaces; Obsoleted by xxxx refers to RFCs that have replaced this one. Updates xxxx refers to other RFCs that this one merely updates (but does not replace);'

test('splitLinesAt: 40', () => {
  expect(splitLinesAt(paragraph, 40)).toEqual([
    'Obsoletes xxxx refers to other RFCs that',
    'this one replaces; Obsoleted by xxxx',
    'refers to RFCs that have replaced this',
    'one. Updates xxxx refers to other RFCs',
    'that this one merely updates (but does',
    'not replace);'
  ])
})

test('splitLinesAt: 50', () => {
  expect(splitLinesAt(paragraph, 50)).toEqual([
    'Obsoletes xxxx refers to other RFCs that this one',
    'replaces; Obsoleted by xxxx refers to RFCs that',
    'have replaced this one. Updates xxxx refers to',
    'other RFCs that this one merely updates (but does',
    'not replace);'
  ])
})

const fourDigitIndexRendering = fs
  .readFileSync(path.join(import.meta.dirname, 'rfc-4digit-index.txt'), 'utf-8')
  .toString()

const fourDigitIndexRenderingUntilRfc13 = fourDigitIndexRendering
  .substring(0, fourDigitIndexRendering.indexOf(' 14'))
  .trimEnd()

const fiveDigitIndexRendering = fs
  .readFileSync(path.join(import.meta.dirname, 'rfc-5digit-index.txt'), 'utf-8')
  .toString()

const fiveDigitIndexRenderingUntilRfc13 = fiveDigitIndexRendering
  .substring(0, fourDigitIndexRendering.indexOf(' 14'))
  .trimEnd()

type TestHelperResponses = {
  oldestRfcResponse: DocListResponse
  seekingResponses: PaginatedRfcMetadataList[]
}

const testHelper = (responses: TestHelperResponses) =>
  new Promise<string>((resolve) => {
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

    let responseTxt = ''
    const push = (str: string) => {
      responseTxt += str
    }

    const close = async () => resolve(responseTxt)

    const abortController = new AbortController()

    ;(async function () {
      await renderRfcIndexDotTxt({
        push,
        close,
        abortController,
        redApi: redApiMock,
        delayBetweenRequestsMs: 0
      })
      resolve(responseTxt)
    })()
  })

describe('renderRfcIndexDotTxt', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  test('compare against original 4 digit-wide rendering', async () => {
    const date = new Date(2025, 0, 14)
    vi.setSystemTime(date)

    const str = await testHelper({
      oldestRfcResponse: twoDigitOldestRfcResponse,
      seekingResponses: [twoDigitRFCDocListResponse]
    })

    // ensure that we read enough of a file
    expect(fourDigitIndexRenderingUntilRfc13.length).toBeGreaterThan(1000)

    // test rendering against a wget of the existing rfc-index.txt truncated to RFC0013
    expect(str.substring(0, fourDigitIndexRenderingUntilRfc13.length)).toEqual(
      fourDigitIndexRenderingUntilRfc13
    )
  })

  test('compare against 5 digit-wide rendering (RFC10k)', async () => {
    const date = new Date(2025, 0, 14)
    vi.setSystemTime(date)

    const fiveDigitRfcNumber = 10000
    const fiveDigitOldestRfcResponse: DocListResponse = {
      ...twoDigitOldestRfcResponse,
      count: fiveDigitRfcNumber,
      results: [
        {
          ...twoDigitOldestRfcResponse.results[0],
          number: fiveDigitRfcNumber
        }
      ]
    }

    const str = await testHelper({
      oldestRfcResponse: fiveDigitOldestRfcResponse,
      seekingResponses: [
        {
          ...twoDigitRFCDocListResponse,
          results: [
            ...twoDigitRFCDocListResponse.results,
            { ...fiveDigitOldestRfcResponse.results[0] }
          ]
        }
      ]
    })

    // ensure that we read enough of a file
    expect(fiveDigitIndexRenderingUntilRfc13.length).toBeGreaterThan(100)

    expect(str.substring(0, fiveDigitIndexRenderingUntilRfc13.length)).toEqual(
      fiveDigitIndexRenderingUntilRfc13
    )
  })
})

const blankRfcResponse: DocListResponse = {
  count: 0,
  results: []
}

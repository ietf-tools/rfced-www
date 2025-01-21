// @vitest-environment nuxt
import fs from 'node:fs'
import path from 'node:path'
import { vi, describe, beforeEach, afterEach, test, expect } from 'vitest'
import { splitLinesAt, renderRfcIndexDotTxt } from './rfc-index-txt'
import {
  ApiClient,
  type PaginatedRfcMetadataList
} from '~/generated/red-client'

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

type DocListResponse = Awaited<ReturnType<ApiClient['red']['docList']>>

type TestHelperResponses = {
  oldestRfcResponse: DocListResponse
  seekingResponses: PaginatedRfcMetadataList[]
}

const testHelper = (responses: TestHelperResponses) =>
  new Promise<string>((resolve) => {
    const redApiMock = new ApiClient({ baseUrl: 'http://localhost/' })
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

const twoDigitRFCDocListResponse: DocListResponse = {
  count: 13,
  next: 'http://localhost:8000/api/red/doc/?limit=50&offset=50&sort=number',
  previous: null,
  results: [
    {
      number: 1,
      title: 'Host Software',
      published: '1969-04-01',
      status: { slug: 'unknown', name: 'unknown' },
      pages: 11,
      authors: [],
      group: { acronym: 'none', name: 'Individual Submissions' },
      area: undefined,
      stream: { slug: 'legacy', name: 'Legacy', desc: 'Legacy' },
      identifiers: [{ type: 'doi', value: '10.17487/RFC0001' }],
      obsoleted_by: [],
      updated_by: [],
      abstract: ''
    },
    {
      number: 2,
      title: 'Host software',
      published: '1969-04-01',
      status: { slug: 'unknown', name: 'unknown' },
      pages: 10,
      authors: [],
      group: { acronym: 'none', name: 'Individual Submissions' },
      area: undefined,
      stream: { slug: 'legacy', name: 'Legacy', desc: 'Legacy' },
      identifiers: [{ type: 'doi', value: '10.17487/RFC0002' }],
      obsoleted_by: [],
      updated_by: [],
      abstract: ''
    },
    {
      number: 3,
      title: 'Documentation conventions',
      published: '1969-04-01',
      status: { slug: 'unknown', name: 'unknown' },
      pages: 2,
      authors: [],
      group: { acronym: 'none', name: 'Individual Submissions' },
      area: undefined,
      stream: { slug: 'legacy', name: 'Legacy', desc: 'Legacy' },
      identifiers: [{ type: 'doi', value: '10.17487/RFC0003' }],
      obsoleted_by: [
        { id: 41973, number: 10, title: 'Documentation conventions' }
      ],
      updated_by: [],
      abstract: ''
    },
    {
      number: 4,
      title: 'Network timetable',
      published: '1969-03-01',
      status: { slug: 'unknown', name: 'unknown' },
      pages: 6,
      authors: [],
      group: { acronym: 'none', name: 'Individual Submissions' },
      area: undefined,
      stream: { slug: 'legacy', name: 'Legacy', desc: 'Legacy' },
      identifiers: [{ type: 'doi', value: '10.17487/RFC0004' }],
      obsoleted_by: [],
      updated_by: [],
      abstract: ''
    },
    {
      number: 5,
      title: 'Decode Encode Language (DEL)',
      published: '1969-06-01',
      status: { slug: 'unknown', name: 'unknown' },
      pages: 17,
      authors: [],
      group: { acronym: 'none', name: 'Individual Submissions' },
      area: undefined,
      stream: { slug: 'legacy', name: 'Legacy', desc: 'Legacy' },
      identifiers: [{ type: 'doi', value: '10.17487/RFC0005' }],
      obsoleted_by: [],
      updated_by: [],
      abstract: ''
    },
    {
      number: 6,
      title: 'Conversation with Bob Kahn',
      published: '1969-04-01',
      status: { slug: 'unknown', name: 'unknown' },
      pages: 1,
      authors: [],
      group: { acronym: 'none', name: 'Individual Submissions' },
      area: undefined,
      stream: { slug: 'legacy', name: 'Legacy', desc: 'Legacy' },
      identifiers: [{ type: 'doi', value: '10.17487/RFC0006' }],
      obsoleted_by: [],
      updated_by: [],
      abstract: ''
    },
    {
      number: 7,
      title: 'Host-IMP interface',
      published: '1969-05-01',
      status: { slug: 'unknown', name: 'unknown' },
      pages: 7,
      authors: [],
      group: { acronym: 'none', name: 'Individual Submissions' },
      area: undefined,
      stream: { slug: 'legacy', name: 'Legacy', desc: 'Legacy' },
      identifiers: [{ type: 'doi', value: '10.17487/RFC0007' }],
      obsoleted_by: [],
      updated_by: [],
      abstract: ''
    },
    {
      number: 8,
      title: 'ARPA Network Functional Specifications',
      published: '1969-05-01',
      status: { slug: 'unknown', name: 'unknown' },
      pages: 0,
      authors: [],
      group: { acronym: 'none', name: 'Individual Submissions' },
      area: undefined,
      stream: { slug: 'legacy', name: 'Legacy', desc: 'Legacy' },
      identifiers: [{ type: 'doi', value: '10.17487/RFC0008' }],
      obsoleted_by: [],
      updated_by: [],
      abstract: ''
    },
    {
      number: 9,
      title: 'Host Software',
      published: '1969-05-01',
      status: { slug: 'unknown', name: 'unknown' },
      pages: 15,
      authors: [],
      group: { acronym: 'none', name: 'Individual Submissions' },
      area: undefined,
      stream: { slug: 'legacy', name: 'Legacy', desc: 'Legacy' },
      identifiers: [{ type: 'doi', value: '10.17487/RFC0009' }],
      obsoleted_by: [],
      updated_by: [],
      abstract: ''
    },
    {
      number: 10,
      title: 'Documentation conventions',
      published: '1969-07-01',
      status: { slug: 'unknown', name: 'unknown' },
      pages: 3,
      authors: [],
      group: { acronym: 'none', name: 'Individual Submissions' },
      area: undefined,
      stream: { slug: 'legacy', name: 'Legacy', desc: 'Legacy' },
      identifiers: [{ type: 'doi', value: '10.17487/RFC0010' }],
      obsoleted_by: [{ id: 41980, number: 16, title: 'M.I.T' }],
      updated_by: [
        { id: 41981, number: 24, title: 'Documentation Conventions' },
        { id: 41982, number: 27, title: 'Documentation Conventions' },
        { id: 41983, number: 30, title: 'Documentation Conventions' }
      ],
      abstract: ''
    },
    {
      number: 11,
      title: 'Implementation of the Host - Host Software Procedures in GORDO',
      published: '1969-08-01',
      status: { slug: 'unknown', name: 'unknown' },
      pages: 23,
      authors: [],
      group: { acronym: 'none', name: 'Individual Submissions' },
      area: undefined,
      stream: { slug: 'legacy', name: 'Legacy', desc: 'Legacy' },
      identifiers: [{ type: 'doi', value: '10.17487/RFC0011' }],
      obsoleted_by: [
        { id: 41985, number: 33, title: 'New Host-Host Protocol' }
      ],
      updated_by: [],
      abstract: ''
    },
    {
      number: 12,
      title: 'IMP-Host interface flow diagrams',
      published: '1969-08-01',
      status: { slug: 'unknown', name: 'unknown' },
      pages: 1,
      authors: [],
      group: { acronym: 'none', name: 'Individual Submissions' },
      area: undefined,
      stream: { slug: 'legacy', name: 'Legacy', desc: 'Legacy' },
      identifiers: [{ type: 'doi', value: '10.17487/RFC0012' }],
      obsoleted_by: [],
      updated_by: [],
      abstract: ''
    },
    {
      number: 13,
      title: 'Zero Text Length EOF Message',
      published: '1969-08-01',
      status: { slug: 'unknown', name: 'unknown' },
      pages: 1,
      authors: [],
      group: { acronym: 'none', name: 'Individual Submissions' },
      area: undefined,
      stream: { slug: 'legacy', name: 'Legacy', desc: 'Legacy' },
      identifiers: [{ type: 'doi', value: '10.17487/RFC0013' }],
      obsoleted_by: [],
      updated_by: [],
      abstract: ''
    }
  ]
}

const twoDigitOldestRfcResponse: DocListResponse = {
  count: 13, //
  next: 'http://localhost:8000/api/red/doc/?limit=5&offset=5&sort=-number',
  previous: null,
  results: [
    [...twoDigitRFCDocListResponse.results].sort(
      // sort by highest number
      (a, b) => b.number - a.number
    )[0] // first result
  ]
}

const blankRfcResponse: DocListResponse = {
  count: 0,
  results: []
}

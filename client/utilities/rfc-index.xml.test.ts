// @vitest-environment nuxt
import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { vi, describe, beforeEach, afterEach, test, expect } from 'vitest'
import { XMLParser } from 'fast-xml-parser'
import { renderRfcIndexDotXml } from './rfc-index-xml'
import { PRIVATE_API_URL } from './url'
import { parseRFCId } from './rfc'
import {
  ApiClient,
  type PaginatedRfcMetadataList
} from '~/generated/red-client'

const originalXMLString = fs
  .readFileSync(path.join(import.meta.dirname, 'rfc-index.xml'), 'utf-8')
  .toString()

const parser = new XMLParser({
  preserveOrder: true
})
const originalXML = parser.parse(originalXMLString)

type DocListResponse = Awaited<ReturnType<ApiClient['red']['docList']>>

/**
 * In the XML there's a NodeList of BCP/FYI/RFC/STD entries which the XMLParser parses into a JS array.
 * The following Zod schema is the minimal amount of structure needed to parse BCP/FYI/RFC/STD
 * entries with typing.
 *
 * We don't need to refine the EntrySchema value further because we have reference XML (originalXML)
 * to parse too which means the XMLParser should produce the same data from the same XML so we can use
 * vitest to diff them rather than validating their exact types. This also avoids any maintenance burden
 * of keeping a Zod schema in sync with the output of XMLBuilder.
 */
const EntryValueSchema = z
  .record(z.string(), z.record(z.string(), z.any()).array())
  .array()
const EntrySchema = z.record(
  z.enum([
    'bcp-entry',
    'rfc-entry',
    'fyi-entry',
    'rfc-not-issued-entry',
    'std-entry'
  ]),
  EntryValueSchema
)
const EntriesSchema = EntrySchema.array()
type Entry = z.infer<typeof EntrySchema>
type RFCEntry = Required<Pick<Entry, 'rfc-entry'>>

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
      await renderRfcIndexDotXml({
        push,
        close,
        abortController,
        redApi: redApiMock,
        delayBetweenRequestsMs: 0
      })
      resolve(responseTxt)
    })()
  })

const filterByRFCEntry = (entry: Entry): entry is RFCEntry => {
  return 'rfc-entry' in entry
}

// const summariseEntries = (entries: any[]) =>
//   entries.reduce(
//     (acc, entry) =>
//       Object.keys(entry).reduce((acc, key, _index, arr) => {
//         if (arr.length === 0) {
//           throw Error(`Entry has no keys?`)
//         }
//         if (!acc[key]) {
//           acc[key] = 0
//         }
//         acc[key]++
//         return acc
//       }, acc),
//     {}
//   )

const getRFCItemByName = (rfcEntry: RFCEntry, key: string) => {
  const item = rfcEntry['rfc-entry'].find((item) => {
    return !!item[key]
  })
  if (!item)
    throw Error(
      `Couldn't find "${key}" in ${JSON.stringify(rfcEntry, null, 2)}`
    )
  return item
}

const getRFCNumber = (rfcEntry: RFCEntry): string => {
  const docIdItem = getRFCItemByName(rfcEntry, 'doc-id')
  const rfcNumber = docIdItem['doc-id'][0]['#text']
  const typeofRFCNumber = typeof rfcNumber !== 'string'
  if (typeofRFCNumber) {
    throw Error(`Expected RFCNumber to be a string but was ${typeofRFCNumber}`)
  }
  return parseRFCId(rfcNumber).number
}

describe('renderRfcIndexDotXml', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  test('compare against original rendering', async () => {
    const date = new Date(2025, 0, 14)
    vi.setSystemTime(date)

    expect(originalXML[0]).toHaveProperty('?xml')
    expect(originalXML[1]).toHaveProperty('rfc-index')
    const originalXMLEntries = originalXML[1]['rfc-index']
    expect(originalXMLEntries.length).toBeGreaterThan(10)
    const originalParsedXML = EntriesSchema.safeParse(originalXMLEntries)
    const originalParsedEntries = originalParsedXML.data
    if (!originalParsedEntries) {
      console.log(originalParsedXML.error)
      throw Error('Expected some results')
    }
    expect(originalParsedXML.success).toBeTruthy()
    const originalRFCs: RFCEntry[] =
      originalParsedEntries.filter(filterByRFCEntry)
    expect(originalRFCs.length).toBeGreaterThan(10)

    const result = await testHelper({
      oldestRfcResponse: twoDigitOldestRfcResponse,
      seekingResponses: [twoDigitRFCDocListResponse]
    })

    const resultParser = new XMLParser({
      preserveOrder: true
    })
    const resultXML = resultParser.parse(result)
    expect(resultXML[0]).toHaveProperty('?xml')
    expect(resultXML[1]).toHaveProperty('rfc-index')
    const resultXMLEntries = resultXML[1]['rfc-index']
    expect(resultXMLEntries.length).toBeGreaterThan(10)
    const resultParsedXML = EntriesSchema.safeParse(resultXMLEntries)
    const resultParsedEntries = resultParsedXML.data
    if (!resultParsedEntries) {
      console.log(resultParsedXML.error)
      throw Error('Expected some results')
    }
    expect(resultParsedXML.success).toBeTruthy()

    const resultRFCs: RFCEntry[] = resultParsedEntries.filter(filterByRFCEntry)
    expect(resultRFCs.length).toBeGreaterThan(10)

    // Intentionally not using test.each() because that would continue running tests after one fails
    // whereas this will fail early and compete the tests much quicker
    resultRFCs.forEach((resultRFC, i) => {
      const originalRFC = originalRFCs[i]
      const originalRFCNumber = getRFCNumber(originalRFC)
      const resultRFCNumber = getRFCNumber(resultRFC)

      expect(originalRFCNumber).toEqual(resultRFCNumber)

      if (
        // FIXME: enable checking more RFCs
        i < 14
      ) {
        // const keyToCheck = 'keywords'
        // const originalItem = getRFCItemByName(originalRFC, keyToCheck)
        // const resultItem = getRFCItemByName(resultRFC, keyToCheck)
        // console.log(
        //   JSON.stringify(originalItem, null, 2),
        //   ' vs ',
        //   JSON.stringify(resultItem, null, 2)
        // )
        expect(resultRFC, `RFC${originalRFCNumber}`).toEqual(originalRFC)
      }
    })
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

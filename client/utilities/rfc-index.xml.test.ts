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
  blankRfcResponse,
  twoDigitOldestRfcResponse,
  twoDigitRFCDocListResponse
} from './rfc.test'
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

// @vitest-environment nuxt
import { test, expect } from 'vitest'
import { parseRFCId, refsRefRfcIdTxt, rfcToRfcJSON } from './rfc'
import { NONBREAKING_SPACE } from './strings'
import rfcRefs from './rfc-refs.json'
import rfcJsons from './rfc-jsons.json'
import { FIXME_getRFCWithMissingData } from './rfc.mocks'
import type { ApiClient, Rfc, RfcMetadata } from '~/generated/red-client'

test('parseRFCId', () => {
  expect(parseRFCId('rfc1234')).toEqual({
    type: 'RFC',
    number: '1234'
  })

  expect(parseRFCId('rfc1234bub')).toEqual({
    type: 'RFC',
    number: '1234',
    title: 'bub'
  })

  expect(parseRFCId(`rfc${NONBREAKING_SPACE}1234`)).toEqual({
    type: 'RFC',
    number: '1234'
  })
})

export type DocListResponse = Awaited<ReturnType<ApiClient['red']['docList']>>

export const twoDigitRFCDocListResponse: DocListResponse = {
  count: 13,
  next: 'http://localhost:8000/api/red/doc/?limit=50&offset=50&sort=number',
  previous: null,
  results: [
    {
      number: 1,
      title: 'Host Software',
      published: '1969-04-01',
      status: {
        slug: 'unknown',
        name: 'unknown'
      },
      pages: 11,
      authors: [],
      group: {
        acronym: 'none',
        name: 'Individual Submissions'
      },
      area: undefined,
      stream: {
        slug: 'legacy',
        name: 'Legacy',
        desc: 'Legacy'
      },
      identifiers: [
        {
          type: 'doi',
          value: '10.17487/RFC0001'
        }
      ],
      obsoletes: [],
      obsoleted_by: [],
      updates: [],
      updated_by: [],
      is_also: [],
      see_also: [],
      draft: undefined,
      abstract: '',
      formats: ['txt', 'html'],
      keywords: [],
      errata: []
    },
    {
      number: 2,
      title: 'Host software',
      published: '1969-04-01',
      status: {
        slug: 'unknown',
        name: 'unknown'
      },
      pages: 10,
      authors: [],
      group: {
        acronym: 'none',
        name: 'Individual Submissions'
      },
      area: undefined,
      stream: {
        slug: 'legacy',
        name: 'Legacy',
        desc: 'Legacy'
      },
      identifiers: [
        {
          type: 'doi',
          value: '10.17487/RFC0002'
        }
      ],
      obsoletes: [],
      obsoleted_by: [],
      updates: [],
      updated_by: [],
      is_also: [],
      see_also: [],
      draft: undefined,
      abstract: '',
      formats: ['txt', 'pdf', 'html'],
      keywords: [],
      errata: ['https://www.rfc-editor.org/errata/rfc2/']
    },
    {
      number: 3,
      title: 'Documentation conventions',
      published: '1969-04-01',
      status: {
        slug: 'unknown',
        name: 'unknown'
      },
      pages: 2,
      authors: [],
      group: {
        acronym: 'none',
        name: 'Individual Submissions'
      },
      area: undefined,
      stream: {
        slug: 'legacy',
        name: 'Legacy',
        desc: 'Legacy'
      },
      identifiers: [
        {
          type: 'doi',
          value: '10.17487/RFC0003'
        }
      ],
      obsoletes: [],
      obsoleted_by: [
        {
          id: 41973,
          number: 10,
          title: 'Documentation conventions'
        }
      ],
      updates: [],
      updated_by: [],
      is_also: [],
      see_also: [],
      draft: undefined,
      abstract: '',
      formats: ['txt', 'html'],
      keywords: [],
      errata: []
    },
    {
      number: 4,
      title: 'Network timetable',
      published: '1969-03-01',
      status: {
        slug: 'unknown',
        name: 'unknown'
      },
      pages: 6,
      authors: [],
      group: {
        acronym: 'none',
        name: 'Individual Submissions'
      },
      area: undefined,
      stream: {
        slug: 'legacy',
        name: 'Legacy',
        desc: 'Legacy'
      },
      identifiers: [
        {
          type: 'doi',
          value: '10.17487/RFC0004'
        }
      ],
      obsoletes: [],
      obsoleted_by: [],
      updates: [],
      updated_by: [],
      is_also: [],
      see_also: [],
      draft: undefined,
      abstract: '',
      formats: ['txt', 'html'],
      keywords: [],
      errata: []
    },
    {
      number: 5,
      title: 'Decode Encode Language (DEL)',
      published: '1969-06-01',
      status: {
        slug: 'unknown',
        name: 'unknown'
      },
      pages: 17,
      authors: [],
      group: {
        acronym: 'none',
        name: 'Individual Submissions'
      },
      area: undefined,
      stream: {
        slug: 'legacy',
        name: 'Legacy',
        desc: 'Legacy'
      },
      identifiers: [
        {
          type: 'doi',
          value: '10.17487/RFC0005'
        }
      ],
      obsoletes: [],
      obsoleted_by: [],
      updates: [],
      updated_by: [],
      is_also: [],
      see_also: [],
      draft: undefined,
      abstract: '',
      formats: ['txt', 'html'],
      keywords: [],
      errata: ['https://www.rfc-editor.org/errata/rfc5/']
    },
    {
      number: 6,
      title: 'Conversation with Bob Kahn',
      published: '1969-04-01',
      status: {
        slug: 'unknown',
        name: 'unknown'
      },
      pages: 1,
      authors: [],
      group: {
        acronym: 'none',
        name: 'Individual Submissions'
      },
      area: undefined,
      stream: {
        slug: 'legacy',
        name: 'Legacy',
        desc: 'Legacy'
      },
      identifiers: [
        {
          type: 'doi',
          value: '10.17487/RFC0006'
        }
      ],
      obsoletes: [],
      obsoleted_by: [],
      updates: [],
      updated_by: [],
      is_also: [],
      see_also: [],
      draft: undefined,
      abstract: '',
      formats: ['txt', 'html'],
      keywords: [],
      errata: []
    },
    {
      number: 7,
      title: 'Host-IMP interface',
      published: '1969-05-01',
      status: {
        slug: 'unknown',
        name: 'unknown'
      },
      pages: 7,
      authors: [],
      group: {
        acronym: 'none',
        name: 'Individual Submissions'
      },
      area: undefined,
      stream: {
        slug: 'legacy',
        name: 'Legacy',
        desc: 'Legacy'
      },
      identifiers: [
        {
          type: 'doi',
          value: '10.17487/RFC0007'
        }
      ],
      obsoletes: [],
      obsoleted_by: [],
      updates: [],
      updated_by: [],
      is_also: [],
      see_also: [],
      draft: undefined,
      abstract: '',
      formats: ['txt', 'html'],
      keywords: [],
      errata: []
    },
    {
      number: 8,
      title: 'ARPA Network Functional Specifications',
      published: '1969-05-01',
      status: {
        slug: 'unknown',
        name: 'unknown'
      },
      pages: 0,
      authors: [],
      group: {
        acronym: 'none',
        name: 'Individual Submissions'
      },
      area: undefined,
      stream: {
        slug: 'legacy',
        name: 'Legacy',
        desc: 'Legacy'
      },
      identifiers: [
        {
          type: 'doi',
          value: '10.17487/RFC0008'
        }
      ],
      obsoletes: [],
      obsoleted_by: [],
      updates: [],
      updated_by: [],
      is_also: [],
      see_also: [],
      draft: undefined,
      abstract: '',
      formats: ['pdf'],
      keywords: [],
      errata: []
    },
    {
      number: 9,
      title: 'Host Software',
      published: '1969-05-01',
      status: {
        slug: 'unknown',
        name: 'unknown'
      },
      pages: 15,
      authors: [],
      group: {
        acronym: 'none',
        name: 'Individual Submissions'
      },
      area: undefined,
      stream: {
        slug: 'legacy',
        name: 'Legacy',
        desc: 'Legacy'
      },
      identifiers: [
        {
          type: 'doi',
          value: '10.17487/RFC0009'
        }
      ],
      obsoletes: [],
      obsoleted_by: [],
      updates: [],
      updated_by: [],
      is_also: [],
      see_also: [],
      draft: undefined,
      abstract: '',
      formats: ['pdf'],
      keywords: [],
      errata: []
    },
    {
      number: 10,
      title: 'Documentation conventions',
      published: '1969-07-01',
      status: {
        slug: 'unknown',
        name: 'unknown'
      },
      pages: 3,
      authors: [],
      group: {
        acronym: 'none',
        name: 'Individual Submissions'
      },
      area: undefined,
      stream: {
        slug: 'legacy',
        name: 'Legacy',
        desc: 'Legacy'
      },
      identifiers: [
        {
          type: 'doi',
          value: '10.17487/RFC0010'
        }
      ],
      obsoletes: [
        {
          id: 41972,
          number: 3,
          title: 'Documentation conventions'
        }
      ],
      obsoleted_by: [
        {
          id: 41980,
          number: 16,
          title: 'M.I.T'
        }
      ],
      updates: [],
      updated_by: [
        {
          id: 41981,
          number: 24,
          title: 'Documentation Conventions'
        },
        {
          id: 41982,
          number: 27,
          title: 'Documentation Conventions'
        },
        {
          id: 41983,
          number: 30,
          title: 'Documentation Conventions'
        }
      ],
      is_also: [],
      see_also: [],
      draft: undefined,
      abstract: '',
      formats: ['txt', 'html'],
      keywords: [],
      errata: []
    },
    {
      number: 11,
      title: 'Implementation of the Host - Host Software Procedures in GORDO',
      published: '1969-08-01',
      status: {
        slug: 'unknown',
        name: 'unknown'
      },
      pages: 23,
      authors: [],
      group: {
        acronym: 'none',
        name: 'Individual Submissions'
      },
      area: undefined,
      stream: {
        slug: 'legacy',
        name: 'Legacy',
        desc: 'Legacy'
      },
      identifiers: [
        {
          type: 'doi',
          value: '10.17487/RFC0011'
        }
      ],
      obsoletes: [],
      obsoleted_by: [
        {
          id: 41985,
          number: 33,
          title: 'New Host-Host Protocol'
        }
      ],
      updates: [],
      updated_by: [],
      is_also: [],
      see_also: [],
      draft: undefined,
      abstract: '',
      formats: ['txt', 'pdf', 'html'],
      keywords: [],
      errata: []
    },
    {
      number: 12,
      title: 'IMP-Host interface flow diagrams',
      published: '1969-08-01',
      status: {
        slug: 'unknown',
        name: 'unknown'
      },
      pages: 1,
      authors: [],
      group: {
        acronym: 'none',
        name: 'Individual Submissions'
      },
      area: undefined,
      stream: {
        slug: 'legacy',
        name: 'Legacy',
        desc: 'Legacy'
      },
      identifiers: [
        {
          type: 'doi',
          value: '10.17487/RFC0012'
        }
      ],
      obsoletes: [],
      obsoleted_by: [],
      updates: [],
      updated_by: [],
      is_also: [],
      see_also: [],
      draft: undefined,
      abstract: '',
      formats: ['txt', 'ps', 'pdf', 'html'],
      keywords: [],
      errata: []
    },
    {
      number: 13,
      title: 'Zero Text Length EOF Message',
      published: '1969-08-01',
      status: {
        slug: 'unknown',
        name: 'unknown'
      },
      pages: 1,
      authors: [],
      group: {
        acronym: 'none',
        name: 'Individual Submissions'
      },
      area: undefined,
      stream: {
        slug: 'legacy',
        name: 'Legacy',
        desc: 'Legacy'
      },
      identifiers: [
        {
          type: 'doi',
          value: '10.17487/RFC0013'
        }
      ],
      obsoletes: [],
      obsoleted_by: [],
      updates: [],
      updated_by: [],
      is_also: [],
      see_also: [],
      draft: undefined,
      abstract: '',
      formats: ['txt', 'html'],
      keywords: [],
      errata: []
    }
  ]
}

export const twoDigitOldestRfcResponse: DocListResponse = {
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

export const blankRfcResponse: DocListResponse = {
  count: 0,
  results: []
}

const rfcMetadataToRfc = (rfcMetadata: RfcMetadata): Rfc => ({
  ...rfcMetadata,
  text: ''
})

test('refsRefRfcIdTxt', () => {
  expect(rfcRefs.snapshots.length).toBeGreaterThan(10)

  rfcRefs.snapshots
    .filter((snapshot) => {
      const filename = snapshot[0]
      const rfcId = parseRFCId(filename)
      return parseFloat(rfcId.number) < 14
    })
    .forEach((snapshot) => {
      const filename = snapshot[0]
      const originalResult = snapshot[1]
      const expectedResult = originalResult.replace(/>\.\n$/, '/>.\n') // expectedResult is same as originalResult except the url has a trailing slash

      const filenameMatches = filename.match(/^ref([0-9]+)\.txt$/)

      if (!filenameMatches) {
        throw Error(`Unable to parse filename ${filename}`)
      }

      const rfcNumberString = filenameMatches[1]
      const rfcNumber = parseInt(rfcNumberString, 10)

      const rfcMetadata = twoDigitRFCDocListResponse.results.find(
        (rfcMetadata) => rfcMetadata.number === rfcNumber
      )

      if (!rfcMetadata) {
        throw Error(
          `Couldn't find RFC ${rfcNumber} in twoDigitRFCDocListResponse.results`
        )
      }

      const rfc: Rfc = rfcMetadataToRfc(rfcMetadata)

      expect(refsRefRfcIdTxt(rfc)).toEqual(expectedResult)
    })
})

test('rfcToRfcJSON', () => {
  expect(rfcJsons.snapshots.length).toBeGreaterThan(10)

  rfcJsons.snapshots
    .filter((snapshot) => {
      const filename = snapshot[0].toString()
      const rfcId = parseRFCId(filename)
      return parseFloat(rfcId.number) < 14
    })
    .forEach((snapshot) => {
      const filename = snapshot[0].toString()
      const expectedResult = snapshot[1]
      if (
        // used to narrow TS type in following code
        typeof expectedResult === 'string'
      ) {
        throw Error('Expected object not string')
      }

      const filenameMatches = filename.match(/^rfc([0-9]+)\.json$/)

      if (!filenameMatches) {
        throw Error(`Unable to parse filename ${filename}`)
      }

      const rfcNumberString = filenameMatches[1]
      const rfcNumber = parseInt(rfcNumberString, 10)

      const removeLeadingZeros = (rfcId: string): string =>
        `RFC${parseRFCId(rfcId).number}`

      const normalizeUrlWithRfcNumber = (url: string | null): string | null => {
        if (!url) return null
        const withoutLeadingZeros = url.replace(/rfc[0]+/g, 'rfc')
        return `${withoutLeadingZeros}/`
      }

      const normalisedExpectedResult = {
        ...expectedResult,
        doc_id: removeLeadingZeros(expectedResult.doc_id),
        keywords: expectedResult.keywords
          .map((keyword) => keyword.trim())
          .filter(Boolean),
        obsoleted_by: expectedResult.obsoleted_by.map((obsoleted_by_item) =>
          removeLeadingZeros(obsoleted_by_item.trim())
        ),
        obsoletes: expectedResult.obsoletes.map((obsoletes_item) =>
          removeLeadingZeros(obsoletes_item.trim())
        ),
        updated_by: expectedResult.updated_by.map((updated_by_item) =>
          removeLeadingZeros(updated_by_item.trim())
        ),
        errata_url: normalizeUrlWithRfcNumber(expectedResult.errata_url),
        // these RFC JSONs have spaces on either end of the title
        title: expectedResult.title.trim()
      }

      const rfcMetadata = twoDigitRFCDocListResponse.results.find(
        (rfcMetadata) => rfcMetadata.number === rfcNumber
      )

      if (!rfcMetadata) {
        throw Error(
          `Couldn't find RFC ${rfcNumber} in twoDigitRFCDocListResponse.results`
        )
      }

      const rfc: Rfc = FIXME_getRFCWithMissingData(
        rfcMetadataToRfc(rfcMetadata)
      )

      expect(rfcToRfcJSON(rfc), `RFC ${rfcNumber} comparison`).toEqual(
        normalisedExpectedResult
      )
    })
})

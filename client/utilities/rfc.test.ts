// @vitest-environment nuxt
import { test, expect } from 'vitest'
import { parseRFCId, refsRefRfcIdTxt } from './rfc'
import { NONBREAKING_SPACE } from './strings'
import rfcRefs from './rfc-refs.json'
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
    .filter((rfcRef) => {
      const filename = rfcRef[0]
      const rfcId = parseRFCId(filename)
      return parseFloat(rfcId.number) < 14
    })
    .forEach((rfcRef) => {
      const filename = rfcRef[0]
      const originalResult = rfcRef[1]
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

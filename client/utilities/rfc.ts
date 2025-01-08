import { parseRFCId } from '~/components/rfc'
import type { RfcMetadata, Rfc } from '../generated/red-client'

const cache: Record<string, Rfc> = {}

export const rfcMetadataToRfc = (rfcMetadata: RfcMetadata): Rfc => {
  const rfcId = parseRFCId(`rfc${rfcMetadata.number}`)
  const cacheId = `${rfcId.type}${rfcId.number}`
  if (!cache[cacheId]) {
    cache[cacheId] = {
      ...blankRfc,
      number: rfcMetadata.number,
      abstract: rfcMetadata.abstract,
      published: rfcMetadata.published,
      status: rfcMetadata.status,
      pages: rfcMetadata.pages,
      authors: rfcMetadata.authors,
      group: rfcMetadata.group,
      area: rfcMetadata.area,
      stream: rfcMetadata.stream,
      identifiers: rfcMetadata.identifiers,
      obsoleted_by: rfcMetadata.obsoleted_by,
      updated_by: rfcMetadata.updated_by,
      title: rfcMetadata.title
    }
  }
  return cache[cacheId]
}

export const blankRfc: Rfc = {
  number: 0,
  title: '',
  published: '1950-1-1',
  status: {
    // @ts-expect-error
    slug: 'standard',
    name: 'standards track'
  },
  pages: 0,
  authors: [],
  group: {
    acronym: '',
    name: ''
  },
  area: {
    acronym: '',
    name: ''
  },
  stream: {
    slug: '',
    name: '',
    desc: ''
  },
  // @ts-expect-error
  identifiers: [],
  obsoleted_by: [],
  updated_by: [],
  abstract: '',
  text: ''
}

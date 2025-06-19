import { z } from 'zod'
import type { RfcCard } from './rfc'

export type TypeSenseClient = {
  clearCache: () => void
  search: (
    searchRequests: Array<TypeSenseSearchRequest>
  ) => Promise<TypeSenseSearchResponse>
  searchForFacetValues: (
    searchRequests: Array<TypeSenseSearchRequest>
  ) => Promise<TypeSenseSearchResponse>
}

export type TypeSenseSearchRequest = {
  indexName: string
  params: {
    query: string
    facets?: string[]
    facetFilters?: string[]
  }
}

export type TypeSenseSearchResponse = {
  results: {
    nbHits: number
  }[]
}

export type TypeSenseSearchItem = z.infer<typeof TypeSenseSearchItemSchema>

// Schema definition https://github.com/ietf-tools/search/blob/main/schemas/docs.md
export const TypeSenseSearchItemSchema = z.object({
  abstract: z.string(),
  adName: z.string().optional(),
  area: z
    .object({
      acronym: z.string(),
      name: z.string(),
      full: z.string()
    })
    .optional(),
  authors: z
    .array(
      z.object({
        name: z.string(),
        affiliation: z.string()
      })
    )
    .optional(),
  bcp: z.string().optional(),
  date: z.number(),
  filename: z.string(),
  flags: z
    .object({
      obsoleted: z.boolean(),
      updated: z.boolean()
    })
    .optional(),
  fyi: z.string().optional(),
  group: z.object({
    acronym: z.string(),
    name: z.string(),
    full: z.string()
  }),
  id: z.string(),
  keywords: z.array(z.string()),
  pages: z.number(),
  publicationDate: z.number(),
  ranking: z.number(),
  rfc: z.string(),
  rfcNumber: z.number(),
  state: z.array(z.string()),
  std: z.string().optional(),
  stdlevelname: z
    .enum([
      'Internet Standard',
      'Proposed Standard',
      'Draft Standard',
      'Best Current Practice',
      'Informational',
      'Experimental',
      'Historic',
      'Unknown'
    ])
    .optional(),
  stream: z.string(),
  subserieTotal: z.number().optional(),
  title: z.string(),
  type: z.string()
})

/**
 * 
 {
  "abstract": "The PPP Working group has developed two protocols, one to control compression on PPP links; the Compression Control Protocol (CCP), documented in draft-ietf-pppext-compression-04.txt. The second is the Encryption Control Protocol (ECP), used to control encryption on serial links, documented in draft-ietf-pppext-encryption-03.txt. This document specifies an Internet Best Current Practices for the Internet Community, and requests discussion and suggestions for improvements.",
  "authors": [
    {
      "affiliation": "",
      "name": "Frank Kastenholz"
    }
  ],
  "bcp": "3",
  "date": 1579594958,
  "filename": "rfc1915",
  "flags": {
    "obsoleted": false,
    "updated": false
  },
  "group": {
    "acronym": "none",
    "full": "none - Individual Submissions",
    "name": "Individual Submissions"
  },
  "id": "doc-123944",
  "keywords": [],
  "pages": 7,
  "publicationDate": 823161600,
  "ranking": 1915,
  "rfc": "1915",
  "rfcNumber": 1915,
  "state": [
    "Published"
  ],
  "stdlevelname": "Best Current Practice",
  "stream": "Legacy",
  "subserieTotal": 1,
  "title": "Variance for The PPP Compression Control Protocol and The PPP Encryption Control Protocol",
  "type": "rfc"
}

 */

export const typeSenseSearchItemToRFC = (
  typeSenseSearchItem: TypeSenseSearchItem
): RfcCard => {
  const result = TypeSenseSearchItemSchema.safeParse(typeSenseSearchItem)
  if (result.error) {
    console.error(result.error.toString())
    throw Error(result.error.toString())
  }

  const item = result.data

  const published = new Date(item.publicationDate * 1000).toISOString()
  const authors =
    item.authors?.map((author, index) => ({
      person: index,
      name: author.name
    })) ?? []

  return {
    abstract: item.abstract,
    area:
      item.area ?
        {
          name: item.area.name,
          acronym: item.area.acronym
        }
      : undefined,
    authors,
    formats: [],
    group: {
      acronym: item.group.acronym,
      name: item.group.name
    },
    number: item.rfcNumber,
    published,
    status: {
      name: item.stdlevelname,
      slug: 'unknown'
    },
    stdlevelname: typeSenseSearchItem.stdlevelname,
    stream: {
      name: item.stdlevelname,
      slug: 'unknown'
    },
    text: '',
    title: item.title
  }
}

export type Density = 'full' | 'dense' | 'compact'

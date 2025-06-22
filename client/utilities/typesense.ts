import { z } from 'zod'

// Schema definition https://github.com/ietf-tools/search/blob/main/schemas/docs.md
export const TypeSenseSearchItemSchema = z.object({
  id: z.string(),

  rfcNumber: z.number(),
  date: z.number(),
  publicationDate: z.number(),

  title: z.string(),

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
  abstract: z.string(),

  adName: z.string().optional(),
  authors: z
    .array(
      z.object({
        name: z.string(),
        affiliation: z.string()
      })
    )
    .optional(),

  subserieTotal: z.number().optional(),
  bcp: z.string().optional(),
  fyi: z.string().optional(),
  std: z.string().optional(),
  his: z.string().optional(),
  rfc: z.string(),

  area: z
    .object({
      acronym: z.string(),
      name: z.string(),
      full: z.string()
    })
    .optional(),
  group: z.object({
    acronym: z.string(),
    name: z.string(),
    full: z.string()
  }),

  stream: z
    .object({
      slug: z.string(),
      name: z.string()
    })
    .optional(),
  ranking: z.number(),
  state: z.array(z.string()),

  type: z.string(),

  filename: z.string(),
  pages: z.number(),
  keywords: z.array(z.string()),

  flags: z
    .object({
      obsoleted: z.boolean(),
      updated: z.boolean()
    })
    .optional()
})

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

export type Density = 'full' | 'dense' | 'compact'

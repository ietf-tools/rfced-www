import type { z } from 'zod'
import type { TypeSenseSearchItemSchema } from './rfc-converters-utils'

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

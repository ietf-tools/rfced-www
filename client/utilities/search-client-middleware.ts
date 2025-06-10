import type { TypeSenseClient } from "./typesense"

export function adaptSearchClient(searchClient: TypeSenseClient): TypeSenseClient {
  return {
  ...searchClient,
  search: (searchRequests) => {
    return searchClient.search(searchRequests.map(r => {
      // ------------------------------------------
      // OVERRIDES
      // ------------------------------------------
      // Series / RFC query
      const seriesMatches = r.params?.query.match(/^(?<series>rfc|bcp|std|fyi)[ :=]{0,3}(?<num>[0-9]+)\s?$/i)
      if (seriesMatches?.groups?.num) {
        if (!r.params.facetFilters) {
          r.params.facetFilters = []
        }
        r.params.facetFilters.push(`${seriesMatches.groups.series}:${seriesMatches.groups.num}`)
        r.params.query = '*'
      }

      return r
    }))
  }
}
}
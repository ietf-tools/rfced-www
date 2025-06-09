import type { TypeSenseClient } from "./typesense"

export function adaptSearchClient(searchClient: TypeSenseClient): TypeSenseClient {
  return {
  ...searchClient,
  search: (searchRequests) => {
    return searchClient.search(searchRequests.map(r => {
      // ------------------------------------------
      // OVERRIDES
      // ------------------------------------------
      // BCP query
      const bcpMatches = r.params?.query.match(/^bcp[ :=]{0,3}(?<num>[0-9]+)\s?$/i)
      if (bcpMatches?.groups?.num) {
        if (!r.params.facetFilters) {
          r.params.facetFilters = []
        }
        r.params.facetFilters.push(`bcp:${bcpMatches.groups.num}`)
        r.params.query = '*'
      }

      return r
    }))
  }
}
}
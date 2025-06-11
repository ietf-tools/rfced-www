import type { TypeSenseClient } from "./typesense"

export function adaptSearchClient(searchClient: TypeSenseClient): TypeSenseClient {
  const searchStore = useSearchStore()

  return {
  ...searchClient,
  search: async (searchRequests) => {
    let isSeries = false

    const resp = await searchClient.search(searchRequests.map(r => {
      // ------------------------------------------
      // OVERRIDES
      // ------------------------------------------
      // RFC Number query
      const rfcMatch = r.params?.query.match(/^rfc[ :=]{0,3}(?<num>[0-9]+)\s?$/i)
      if (rfcMatch?.groups?.num) {
        if (!r.params.facetFilters) {
          r.params.facetFilters = []
        }
        r.params.facetFilters.push(`rfc:${rfcMatch.groups.num}`)
        r.params.query = '*'

        return r
      }

      // Series query (BCP, STD, FYI)
      const seriesMatch = r.params?.query.match(/^(?<series>bcp|std|fyi)[ :=]{0,3}(?<num>[0-9]+)\s?$/i)
      if (seriesMatch?.groups?.num) {
        if (!r.params.facetFilters) {
          r.params.facetFilters = []
        }
        r.params.facetFilters.push(`${seriesMatch.groups.series}:${seriesMatch.groups.num}`)
        r.params.query = '*'

        isSeries = true
        searchStore.seriesLabel = `${seriesMatch.groups.series.toUpperCase()} ${seriesMatch.groups.num}`
        searchStore.seriesHref = `/info/${seriesMatch.groups.series.toLowerCase()}${seriesMatch.groups.num}`
      } else {
        isSeries = false
      }

      return r
    }))

    // Set series only if there're results
    searchStore.isSeries = Boolean(isSeries && resp.results?.[0].nbHits > 0)

    return resp
  }
}
}
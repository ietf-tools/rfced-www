<template>
  <div class="min-h-[100vh]">
    <NuxtLayout name="default">
      <template #subheader>
        <div class="container mx-auto">
          <Heading level="1" class="w-full mt-0 mb-3 pl-5 md:p-0 text-balance">
            Search RFCs
          </Heading>
          <div class="lg:w-1/2">
            <SearchBox />
          </div>
        </div>
      </template>

      <ais-instant-search :index-name="indexName" :search-client="searchClient" :initial-ui-state="initialUiState">
        <div class="container mx-auto flex flex-row items-start py-5">
          <div class="hidden lg:w-1/3 lg:block">
            <SearchFilter />
          </div>
          <div class="w-full lg:w-2/3">
            <div class="flex flex-row justify-between items-center">
              <Heading
                level="2"
                style-level="4"
                class="text-left pl-4 md:pl-0"
                aria-atomic="true"
                aria-live="polite"
              >
                <template
                  v-if="!searchStore.searchResponse && !searchStore.searchError"
                >
                  Loading...
                </template>
                <template v-else-if="searchStore.searchResponse">
                  <span class="font-normal">Showing </span>
                  <span v-if="searchStore.offset > 0">
                    <b>
                      {{ searchStore.offset }}&ndash;{{
                        searchStore.offset + DEFAULT_LIMIT
                      }}
                    </b>
                    <span class="font-normal"> of </span>
                  </span>
                  <b>
                    {{ searchStore.searchResponse.count }}
                    <span v-if="searchStore.searchResponse.count === 1">
                      result
                    </span>
                    <span v-else>results</span>
                  </b>
                </template>
              </Heading>
              <div class="hidden lg:block">
                <label class="text-base">
                  <span>Sort by</span>
                  <ais-sort-by
                    class="text-base ml-2 bg-white text-black dark:bg-black dark:text-white dark:border"
                    :items="[
                      { value: 'docs', label: 'Relevancy' },
                      { value: 'docs/sort/rfcNumber:asc', label: 'RFC no. (Lowest first)' },
                      { value: 'docs/sort/rfcNumber:desc', label: 'RFC no. (Highest first)' }
                    ]"
                  />
                </label>
              </div>
              <div class="lg:hidden print:hidden">
                <SearchMobileFilter />
              </div>
            </div>

            <div class="container mx-auto">
              <div class="flex flex-row flex-wrap pb-4">
                <main role="main" class="w-full px-2">
                  <ais-search-box>
                    <template v-slot="{ currentRefinement, isSearchStalled, refine }">
                      <div class="flex flex-row items-center">
                        <input type="search" :value="currentRefinement" @input="refine($event.currentTarget.value)" placeholder="Search..." class="input input-bordered w-full" />
                        <span v-show="isSearchStalled" class="loading loading-spinner text-primary me-2"></span>
                        <ais-stats>
                          <template v-slot="{ nbHits, processingTimeMS }">
                            <div class="ms-4 text-sm w-max text-zinc-500"><span class="font-medium">{{ nbHits.toLocaleString('en', { useGrouping: true }) }}</span> hits in <span class="font-medium">{{ processingTimeMS }}ms</span></div>
                          </template>
                        </ais-stats>
                      </div>
                    </template>
                  </ais-search-box>
                  <ais-hits class="mt-4">
                    <template v-slot="{
                      items,
                      sendEvent
                    }">
                      <ul>
                        <li v-for="item in items" :key="item.objectID" class="card bg-zinc-50 p-4 shadow-sm mb-2">
                          <div class="flex flex-row">
                            <h1 class="font-medium grow"><a :href="`https://datatracker.ietf.org/doc/` + item.filename + `/`">{{ item.title }}</a></h1>
                            <span v-if="item.ref" class="text-sm font-medium text-rose-800">{{ item.ref.toUpperCase() }}</span>
                          </div>
                          <span class="text-sm font-medium text-gray-600">{{ item.filename }}</span>
                          <span class="text-sm line-clamp-2 mt-2"><em>{{ item.abstract }}</em></span>
                          <div class="flex flex-row mt-2">
                            <div class="text-sm font-medium text-sky-700 grow">{{ item.authors?.map(a => a.name).join(', ') }}</div>
                            <div v-if="item.groupName" class="text-right">
                              <div class="text-sm text-orange-800">{{ item.groupName }}</div>
                              <div v-if="item.areaName" class="text-xs text-orange-800">{{ item.areaName }}</div>
                            </div>
                          </div>
                        </li>
                        <div class="flex flex-row justify-center"><ais-pagination /></div>
                      </ul>
                    </template>
                  </ais-hits>
                </main>
              </div>
            </div>
          </div>
        </div>
      </ais-instant-search>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import {
  AisInstantSearch,
  AisSearchBox,
  AisStats,
  AisHits,
  AisPagination,
  AisSortBy
} from 'vue-instantsearch/vue3/es'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'
import { useSearchStore, DEFAULT_LIMIT } from '~/stores/search'

const searchStore = useSearchStore()

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "j2ZodfQTgoa4Vn5BCOdvKJe7fWmcqYhH", // Be sure to use an API key that only allows search operations
    nodes: [
      {
        host: "typesense.ietf.org",
        path: "",
        port: 443,
        protocol: "https",
      },
    ],
    cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  query_by is required.
  additionalSearchParameters: {
    query_by: "rfcNumber,ref,filename,title,abstract,keywords,authors,adName,group,groupName,area,areaName",
  }
})
const indexName = 'docs'
const searchClient = typesenseInstantsearchAdapter.searchClient
const initialUiState = {
  docs: {
    refinementList: {
      type: ['rfc']
    }
  }
}

definePageMeta({
  layout: false
})
</script>

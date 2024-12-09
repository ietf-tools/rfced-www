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
                <select
                  v-model="searchStore.orderBy"
                  class="text-base ml-2 bg-white text-black dark:bg-black dark:text-white dark:border"
                >
                  <option value="lowest">RFC no. (Lowest first)</option>
                  <option value="highest">RFC no. (Highest first)</option>
                </select>
              </label>
            </div>
            <div class="lg:hidden print:hidden">
              <SearchMobileFilter />
            </div>
          </div>

          <div v-if="searchStore.searchError">
            <Alert
              variant="warning"
              heading="Unable to search RFCs. Please try again later."
            >
              {{ searchStore.searchError }}
            </Alert>
          </div>

          <ul
            v-if="searchStore.searchResponse"
            class="mt-4 w-full flex flex-col gap-4"
          >
            <li
              v-for="(searchResult, searchIndex) in searchStore.searchResponse
                .results"
              :key="searchIndex"
            >
              <RFCCardSearchItem
                :key="searchResult.number"
                :search-item="searchResult"
              />
            </li>
          </ul>

          <div
            :class="[
              'flex mt-4',
              {
                'justify-start':
                  searchStore.searchResponse &&
                  searchStore.searchResponse.previous &&
                  !searchStore.searchResponse.next,
                'justify-between':
                  searchStore.searchResponse &&
                  searchStore.searchResponse.previous &&
                  searchStore.searchResponse.next,
                'justify-end':
                  searchStore.searchResponse &&
                  !searchStore.searchResponse.previous &&
                  searchStore.searchResponse.next
              }
            ]"
          >
            <button
              v-if="
                searchStore.searchResponse &&
                searchStore.searchResponse.previous
              "
              class="border font-bold px-4 py-3 mt-6 bg-blue-400 text-white hover:bg-blue-200 focus:bg-blue-200"
              @click="searchStore.offset -= 10"
            >
              Previous
            </button>

            <button
              v-if="
                searchStore.searchResponse && searchStore.searchResponse.next
              "
              class="border font-bold px-4 py-3 mt-6 bg-blue-400 text-white hover:bg-blue-200 focus:bg-blue-200"
              @click="searchStore.offset += 10"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore, DEFAULT_LIMIT } from '~/stores/search'

const searchStore = useSearchStore()

definePageMeta({
  layout: false
})
</script>

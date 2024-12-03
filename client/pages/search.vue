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
              class="text-left"
              aria-atomic="true"
              aria-live="polite"
            >
              <template v-if="!searchStore.q"><!-- no search --></template>
              <template v-else-if="!searchStore.searchResults">
                Loading...
              </template>
              <template v-else>
                <span class="font-normal">Showing </span>
                <b>{{ searchStore.searchResults.count }} results</b>
                <span class="font-normal"> for "{{ searchStore.q }}" </span>
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
          <ul
            v-if="searchStore.searchResults"
            class="mt-4 w-full flex flex-col gap-4"
          >
            <li
              v-for="(searchResult, searchIndex) in searchStore.searchResults
                .results"
              :key="searchIndex"
            >
              <RFCCard
                heading-level="3"
                :title="searchResult.name"
                href="/"
                :tag="['Informational']"
                :list1="[
                  formatAuthors(searchResult.authors),
                  formatDate(
                    // typing is wrong. it's actually a string
                    searchResult.published as unknown as string
                  )
                ]"
                :list2="formatStreamAndArea(searchResult)"
                abstract="This paragraph represents this abstract for this particular RFC. It would likely only be one or two paragraphs long. This paragraph represents this abstract for this particular RFC. It would likely only be one or two paragraphs long."
                red-note=""
              >
                {{ searchResult.title }}
              </RFCCard>
            </li>
          </ul>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { useSearchStore } from '~/stores/search'

const searchStore = useSearchStore()

definePageMeta({
  layout: false
})

type SearchResult = NonNullable<
  typeof searchStore.searchResults
>['results'][number]

type Authors = SearchResult['authors']

function formatAuthors(authors: Authors): string {
  if (authors.length === 0) {
    return ''
  }
  if (authors.length === 1) {
    return `${authors[0].name}`
  }

  return `${authors[0].name} and ${authors.length - 1} other${
    authors.length > 2 ? 's' : ''
  }`
}

function formatStreamAndArea(searchResult: SearchResult): string[] {
  return [searchResult.stream?.name, searchResult.area?.name].filter(
    Boolean
  ) as string[]
}

function formatDate(isoDate: string): string {
  const datetime = DateTime.fromISO(isoDate)
  return datetime.toLocaleString({ month: 'long', year: 'numeric' })
}
</script>

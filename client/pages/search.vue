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
              <template v-if="!searchStore.searchResults">
                Loading...
              </template>
              <template v-else>
                <span class="font-normal">Showing </span>
                <b>
                  {{ searchStore.searchResults.count }}
                  <span v-if="searchStore.searchResults.count === 1">
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
                :title="`RFC${searchResult.number}`"
                :href="rfcUrlBuilder(searchResult.number)"
                :tag="[searchResult.status.name]"
                :list1="[
                  formatAuthors(searchResult.authors),
                  formatDate(searchResult.published)
                ]"
                :list2="formatStreamAndArea(searchResult)"
                abstract=""
                :red-note="formatObsoletedBy(searchResult.obsoleted_by)"
              >
                {{ searchResult.title }}
              </RFCCard>
            </li>
          </ul>

          <button
            v-if="
              searchStore.searchResults && searchStore.searchResults.previous
            "
            @click="searchStore.offset -= 10"
            class="border-2 p-3"
          >
            Previous
          </button>

          <button
            v-if="searchStore.searchResults && searchStore.searchResults.next"
            @click="searchStore.offset += 10"
            class="border-2 p-3"
          >
            Next
          </button>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { useSearchStore } from '~/stores/search'
import { rfcUrlBuilder } from '~/utilities/urlBuilder'

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

function formatObsoletedBy(
  obsoletedBy: SearchResult['obsoleted_by']
): VNode | undefined {
  if (!obsoletedBy || obsoletedBy.length === 0) return undefined

  return h(
    'span',
    obsoletedBy.reduce(
      (acc, obsoletedByItem, index) => {
        if (index > 0) {
          acc.push(', ')
        }
        acc.push(
          h(
            'a',
            {
              href: rfcUrlBuilder(obsoletedByItem.number),
              title: `RFC${obsoletedByItem.number}: ${obsoletedByItem.title}`,
              class: 'relative z-50 underline p-1 -m-1 hover:bg-gray-100'
            },
            ['RFC', h('b', obsoletedByItem.number)]
          )
        )

        return acc
      },
      ['Obsoleted by '] as (string | VNode)[]
    )
  )
}
</script>

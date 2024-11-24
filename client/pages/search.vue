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
              <template
                v-else-if="
                  !searchStore.searchResults ||
                  searchStore.searchResults.length === 0
                "
              >
                Loading...
              </template>
              <template v-else>
                <span class="font-normal">Showing </span>
                <b>{{ searchStore.searchResults.length }} results</b>
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
              v-for="(searchResult, searchIndex) in searchStore.searchResults"
              :key="searchIndex"
            >
              <RFCCard
                heading-level="3"
                title="RFC9392"
                href="/"
                :tag="{
                  type: 'Informational',
                  date: new Date(Date.now() - 3 * (24 * 60 * 60 * 1000))
                }"
                :body="['C. Perkins', 'Date']"
                :footer="['IETF Stream']"
                abstract="This paragraph represents this abstract for this particular RFC. It would likely only be one or two paragraphs long. This paragraph represents this abstract for this particular RFC. It would likely only be one or two paragraphs long."
                red-note="sdfsdf"
              >
                Message Header Field for Indicating Message Authentication
                Status
              </RFCCard>
            </li>
          </ul>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from '~/stores/search'

const searchStore = useSearchStore()

definePageMeta({
  layout: false
})
</script>

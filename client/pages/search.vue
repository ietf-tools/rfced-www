<template>
  <div class="min-h-[100vh]">
    <NuxtLayout name="default">
      <template #subheader>
        <div class="container mx-auto">
          <Heading level="1" class="w-full mt-0 mb-3 pl-5 md:p-0 text-balance">
            Search RFCs
          </Heading>
          <SearchBox />
        </div>
      </template>

      <div class="flex flex-row items-start py-5">
        <div class="w-full lg:w-1/2">
          <div class="lg:flex flex-row justify-between">
            <Heading
              level="2"
              style-level="4"
              class="text-left pl-5 md:pl-0"
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
              <label class="text-sm">
                <span>Sort by</span>
                <select v-model="searchStore.orderBy" class="text-sm ml-2">
                  <option value="lowest">RFC no. (Lowest first)</option>
                  <option value="highest">RFC no. (Highest first)</option>
                </select>
              </label>
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
                author="C. Perkins"
                :tag="{
                  type: 'Informational',
                  date: new Date(Date.now() - 3 * (24 * 60 * 60 * 1000))
                }"
                intro="Message Header Field for Indicating Message Authentication Status"
                :body="['C. Perkins', 'Date']"
                :footer="['IETF Stream']"
                abstract="This paragraph represents this abstract for this particular RFC. It would likely only be one or two paragraphs long. This paragraph represents this abstract for this particular RFC. It would likely only be one or two paragraphs long."
              />
            </li>
          </ul>
        </div>
        <div class="hidden lg:w-1/2 lg:block pl-10">
          <SearchFilter class="border-l-2 pl-10" />
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

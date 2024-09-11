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

      <div class="flex flex-row items-start gap-5">
        <div class="lg:w-1/2">
          <div class="flex flex-row justify-between">
            <Heading
              level="2"
              class="text-lg text-left pl-5 md:pl-0"
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
                Showing
                <b>{{ searchStore.searchResults.length }} results</b> for "{{
                  searchStore.q
                }}"
                <span v-if="searchStore.hasFilters"> (with filters) </span>
              </template>
            </Heading>
            <div>
              <label class="font-bold">
                Sort by
                <select v-model="searchStore.orderBy">
                  <option value="lowest">RFC no. (Lowest first)</option>
                  <option value="highest">RFC no. (Highest first)</option>
                </select>
              </label>
            </div>
          </div>
          <ul v-if="searchStore.searchResults">
            <li
              v-for="(searchResult, searchIndex) in searchStore.searchResults"
              :key="searchIndex"
            >
              {{ searchResult }}
            </li>
          </ul>
        </div>
        <div class="hidden lg:w-1/2 lg:block">
          <SearchFilter />
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

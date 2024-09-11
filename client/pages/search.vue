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

      <div class="flex flex-col lg:items-center justify-between">
        <Heading level="2" has-icon class="text-left pl-5 md:pl-0">
          <span v-if="!searchStore.q"> ... </span>
          <span v-else-if="!searchStore.searchResults"> Loading... </span>
          <span v-else>
            Showing <b>{{ searchStore.searchResults.length }} results</b> for
            "{{ searchStore.q }}"
            <span v-if="searchStore.hasFilters"> (with filters) </span>
          </span>
        </Heading>

        <ul v-if="searchStore.searchResults">
          <li
            v-for="(searchResult, searchIndex) in searchStore.searchResults"
            :key="searchIndex"
          >
            {{ searchResult }}
          </li>
        </ul>

        {{ searchStore.statuses }}
        <SearchFilter />
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

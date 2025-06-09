<template>
  <label class="text-base flex flex-row items-center">
    <span class="mr-2">Sort by</span>
    <ais-sort-by
      :items="[
        {
          value: 'docs',
          label: 'Relevancy'
        },
        {
          value: 'docs/sort/rfcNumber:asc',
          label: 'RFC no. (Lowest first)'
        },
        {
          value: 'docs/sort/rfcNumber:desc',
          label: 'RFC no. (Highest first)'
        },
        {
          value: 'docs/sort/publicationDate:asc',
          label: 'Publication date (Oldest first)'
        },
        {
          value: 'docs/sort/publicationDate:desc',
          label: 'Publication date (Newest first)'
        }
      ]"
      :class-names="{
        'ais-SortBy': 'px-2 bg-white text-base border border-gray-400 dark:bg-black dark:border-white dark:text-white px-1 shadow-sm rounded-xs scheme-light dark:scheme-dark',
        'ais-SortBy-select': 'py-2 text-base dark:text-white scheme-light dark:scheme-dark'
      }"
    />
  </label>
</template>

<script setup lang="ts">
import { AisSortBy } from 'vue-instantsearch/vue3/es'
</script>
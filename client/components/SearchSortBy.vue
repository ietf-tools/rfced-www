<template>
  <label class="text-base">
    <span>Sort by</span>
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
        'ais-SortBy-select':
          'text-base ml-2 bg-white text-black dark:bg-black dark:text-white dark:border'
      }"
    />
  </label>
</template>

<script setup lang="ts">
import { AisSortBy } from 'vue-instantsearch/vue3/es'
</script>
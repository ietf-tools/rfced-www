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
    >
      <template #default="{ items, currentRefinement, refine }">
        <SelectNeue
          :model-value="currentRefinement"
          @update:model-value="(val) => refine(val)"
        >
          <option
            v-for="item of items"
            :key="item.value"
            :value="item.value"
            class="flex items-center pl-[20px] cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            {{ item.label }}
          </option>
        </SelectNeue>
      </template>
    </ais-sort-by>
  </label>
</template>

<script setup lang="ts">
import { AisSortBy } from 'vue-instantsearch/vue3/es'
</script>

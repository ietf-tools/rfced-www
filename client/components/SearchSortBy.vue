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
        <select-root
          :model-value="currentRefinement"
          @update:model-value="val => refine(val)"
          >
          <select-trigger
            class="flex items-center px-3 h-[37px] bg-white text-base border border-gray-400 dark:bg-black dark:border-white dark:text-white shadow-sm rounded-xs scheme-light dark:scheme-dark"
            aria-label="Sort by"
          >
            <select-value />
            <icon name="ph:caret-down-bold" size=".8em" class="ml-1" />
          </select-trigger>
          <select-portal>
            <select-content
              class="bg-white dark:bg-black rounded-xs border shadow-sm z-[100]"
              :side-offset="5"
            >
              <select-viewport class="p-[5px]">
                <select-item
                  v-for="item of items"
                  :key="item.value"
                  :value="item.value"
                  class="flex items-center pl-[20px] cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
                  >
                  <SelectItemIndicator class="absolute left-0 w-[25px] inline-flex items-center justify-center">
                    <icon name="fa-solid:check" size=".8em" />
                  </SelectItemIndicator>
                  <select-item-text>{{ item.label }}</select-item-text>
                </select-item>
              </select-viewport>
            </select-content>
          </select-portal>
        </select-root>
      </template>
    </ais-sort-by>
  </label>
</template>

<script setup lang="ts">
import { AisSortBy } from 'vue-instantsearch/vue3/es'
</script>

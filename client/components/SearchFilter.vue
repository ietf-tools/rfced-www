<template>
  <form
    class="flex flex-col gap-5 text-base text-grey-800 pt-3 lg:pt-0 pl-5 lg:pl-0 lg:pr-10"
  >
    <Heading level="2" style-level="4" class="hidden lg:block">
      Filter
    </Heading>

    <SearchFilterStatuses />

    <DateYearMonthRange
      v-model:start="startValue"
      v-model:end="endValue"
      start-range-date="1968-12-31"
      label="Publication date"
      start-label="from"
      start-placeholder="Date from"
      end-label="to"
      end-placeholder="Date to"
    />

    <SearchFilterSelect label="Stream" attribute="stream" />

    <SearchFilterSelect label="Area" attribute="area" />

    <SearchFilterSelect label="Working group" attribute="group" searchable />

    <ais-clear-refinements
      :excluded-attributes="['type']"
      class="hidden lg:block"
    >
      <template #default="{ canRefine, refine }">
        <button
          type="button"
          class="underline text-blue-700 dark:text-blue-100 px-3 py-2 -ml-3 cursor-pointer"
          :disabled="!canRefine"
          @click.prevent="refine"
        >
          Clear all
        </button>
      </template>
    </ais-clear-refinements>
  </form>
</template>

<script setup lang="ts">
import { AisClearRefinements } from 'vue-instantsearch/vue3/es'

const startValue = ref()
const endValue = ref()
</script>

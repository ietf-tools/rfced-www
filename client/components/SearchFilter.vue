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
      :start-range-date="OLDEST_RFC"
      :end-range-date="NEWEST_POTENTIAL_RFC"
      label="Publication date"
      start-label="from"
      start-placeholder="Date from"
      end-label="to"
      end-placeholder="Date to"
    />

    <SearchFilterSelect
      v-model="searchStore.stream"
      label="Stream"
      :options="Object.entries(Streams)"
    />

    <SearchFilterSelect
      v-model="searchStore.area"
      label="Area"
      :options="Object.entries(Areas)"
    />

    <SearchFilterSelect
      v-model="searchStore.workingGroup"
      label="Working group"
      :options="Object.entries(WorkingGroups)"
    />

    <div class="hidden lg:block">
      <button
        type="button"
        class="underline text-blue-700 dark:text-blue-100 px-3 py-2 -ml-3"
        @click="searchStore.clearFilters()"
      >
        Clear all
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
// This template and any descendant components within it might be rendered multiple times
// simultaneously in the DOM so please ensure unique DOM ids, or avoid them entirely (eg
// <label> wrapping)
import { useSearchStore, Streams, Areas, WorkingGroups } from '~/stores/search'

const searchStore = useSearchStore()

function parseDate(yearMonth: string): Date | undefined {
  if (yearMonth === '') {
    return undefined
  }
  const [year, month] = yearMonth.split('-')
  return new Date(parseFloat(year), parseFloat(month) - 1)
}

/**
 * The store uses `Date` objects whereas <DateYearMonthRange> expects
 * strings of `YYYY-M` (eg `2024-3`) so we'll convert them here.
 **/
const startValue = computed({
  get() {
    return stringifyDate(searchStore.publicationDateFrom)
  },
  set(yearMonth: string) {
    searchStore.publicationDateFrom = parseDate(yearMonth)
  }
})
const endValue = computed({
  get() {
    return stringifyDate(searchStore.publicationDateTo)
  },
  set(yearMonth: string) {
    searchStore.publicationDateTo = parseDate(yearMonth)
  }
})

const OLDEST_RFC = new Date('1969-01-01')
const NEWEST_POTENTIAL_RFC = new Date()
</script>

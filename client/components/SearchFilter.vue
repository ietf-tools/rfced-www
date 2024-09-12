<template>
  <form class="text-base text-grey-800 pt-3 lg:pt-0 pl-5 md:pl-0">
    <Heading level="3" class="text-lg">Filter</Heading>

    <fieldset>
      <legend class="font-bold">Status</legend>
      <ul>
        <li
          v-for="([statusValue, statusLabel], statusIndex) in Object.entries(
            Statuses
          )"
          :key="statusIndex"
        >
          <label>
            <input
              type="checkbox"
              :value="statusValue"
              :checked="searchStore.statuses.includes(statusValue as StatusValue)"
              @click="searchStore.toggleStatus(statusValue as StatusValue)"
            />
            {{ statusLabel }}
          </label>
        </li>
      </ul>
    </fieldset>

    <DateRange
      label="Publication date (range)"
      start-label="from"
      end-label="to"
      :start-model="searchStore.publicationDateFrom"
      :end-model="searchStore.publicationDateTo"
    />
  </form>
</template>

<script setup lang="ts">
// This template might be used several times in the DOM so ensure unique DOM ids
// or don't use ids (eg <label> wrapping input, rather than for="id")
import { useSearchStore, Statuses } from '~/stores/search'
import type { StatusValue } from '~/stores/search'

const searchStore = useSearchStore()
</script>

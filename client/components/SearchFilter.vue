<template>
  <form class="text-base text-grey-800 pt-3 lg:pt-0 pl-5 md:pl-0">
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

    <label class="font-bold">
      Sort by
      <select>
        <option>RFC no. (Lowest first)</option>
        <option>RFC no. (Highest first)</option>
      </select>
    </label>
  </form>
</template>

<script setup lang="ts">
// This template might be used several times in the DOM so ensure unique DOM ids
// or don't use ids (eg <label> wrapping input, rather than for="id")
import { useSearchStore, Statuses } from '~/stores/search'
import type { StatusValue } from '~/stores/search'

const searchStore = useSearchStore()
</script>

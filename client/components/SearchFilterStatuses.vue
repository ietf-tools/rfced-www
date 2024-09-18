<template>
  <fieldset>
    <legend class="font-bold mb-2">Status</legend>
    <ul class="grid-cols-2 grid gap-1 lg:w-3/4">
      <li
        v-for="(statusLabel, statusValue, statusIndex) in Statuses"
        :key="statusIndex"
      >
        <label class="text-sm cursor-pointer">
          <input
            class="mr-2"
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
</template>

<script setup lang="ts">
import { useSearchStore, Statuses } from '~/stores/search'
import type { StatusValue } from '~/stores/search'

const searchStore = useSearchStore()
</script>

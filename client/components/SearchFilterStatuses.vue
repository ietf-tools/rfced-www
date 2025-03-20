<template>
  <fieldset>
    <legend class="text-base font-bold mb-2">Status</legend>
    <ul class="grid-cols-1 2xl:grid-cols-2 grid gap-1">
      <li
        v-for="(statusLabel, statusValue, statusIndex) in Statuses"
        :key="statusIndex"
      >
        <label class="text-base cursor-pointer">
          <input
            class="mr-1 size-6 align-middle scheme-light dark:scheme-dark"
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

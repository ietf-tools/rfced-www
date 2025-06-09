<template>
  <ais-clear-refinements
    :excluded-attributes="['type']"
  >
    <template #default="{ canRefine, refine }">
      <button
        type="button"
        class="underline text-sky-700 dark:text-blue-100 px-3 py-2 -ml-3 cursor-pointer"
        :disabled="!canRefine"
        @click.prevent="refine"
      >
        Clear all
      </button>
    </template>
  </ais-clear-refinements>
</template>

<script setup lang="ts">
import { AisClearRefinements } from 'vue-instantsearch/vue3/es'
</script>

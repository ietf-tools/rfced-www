<template>
  <ais-refinement-list
    attribute="stdlevelname"
    :sort-by="reorderItems"
  >
    <template #default="{ items, refine }">
      <fieldset>
        <legend class="text-base font-bold mb-2">Status</legend>
        <ul class="grid-cols-1 2xl:grid-rows-4 grid gap-1 2xl:grid-flow-col 2xl:auto-cols-fr">
          <li v-for="item in items" :key="item.value">
            <label class="text-base cursor-pointer">
              <input
                class="mr-1 size-6 align-middle scheme-light dark:scheme-dark"
                type="checkbox"
                :value="item.value"
                :checked="item.isRefined"
                @click="refine(item.value)"
              />
              {{ item.label }}
            </label>
          </li>
        </ul>
      </fieldset>
    </template>
  </ais-refinement-list>
</template>

<script setup lang="ts">
import { AisRefinementList } from 'vue-instantsearch/vue3/es'

const predefinedOrder = [
  'Internet Standard',
  'Proposed Standard',
  'Draft Standard',
  'Best Current Practice',
  'Experimental',
  'Historic',
  'Informational',
  'Unknown'
]

function reorderItems(a: { name: string }, b: { name: string }) {
  return predefinedOrder.indexOf(a.name) - predefinedOrder.indexOf(b.name)
}
</script>

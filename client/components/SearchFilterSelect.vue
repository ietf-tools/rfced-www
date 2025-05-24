<template>
  <ais-menu-select :attribute="props.attribute" :limit="100">
    <template #default="{ items, canRefine, refine }">
      <label>
        <span class="text-base font-bold block mb-1">{{ props.label }}</span>
        <select
          :disabled="!canRefine"
          class="w-full text-base border border-gray-400 dark:border-white dark:text-white py-2 pl-1 pr-6 scheme-light dark:scheme-dark"
          @change="refine($event.currentTarget.value)"
        >
          <option value="">All</option>
          <option
            v-for="item in items"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </option>
        </select>
      </label>
    </template>
  </ais-menu-select>
</template>

<script setup lang="ts">
import { AisMenuSelect } from 'vue-instantsearch/vue3/es'
import type { VueStyleClass } from '~/utilities/vue'

type Props = {
  attribute: string
  label: string
  /**
   * An array of <option>'s of [value, label]. Eg.
   * ```
   * [
   *   ['red', 'Red'],
   *   ['green', 'Green'],
   *   ['blue', 'Blue']
   * ]
   * ```
   */
  class?: VueStyleClass
}

const props = defineProps<Props>()

const value = defineModel<string>()
</script>

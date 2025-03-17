<template>
  <label>
    <span class="text-base font-bold block mb-1">{{ props.label }}</span>
    <select
      v-model="value"
      class="w-full text-base border border-gray-400 dark:border-white dark:text-white py-2 pl-1 pr-6 scheme-light dark:scheme-dark"
    >
      <option
        v-for="([itemValue, itemLabel], itemIndex) in props.options"
        :key="itemIndex"
        :value="itemValue"
      >
        {{ itemLabel }}
      </option>
    </select>
  </label>
</template>

<script setup lang="ts">
type Props = {
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
  options: [string, string][]
  class?: string
}

const props = defineProps<Props>()

const value = defineModel<string>()
</script>

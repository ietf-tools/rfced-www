<template>
  <label>
    <span class="text-sm font-bold block mb-1">{{ props.label }}</span>
    <select v-model="value" class="clear-both text-sm">
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
}

const props = defineProps<Props>()

const value = defineModel<string>()
</script>

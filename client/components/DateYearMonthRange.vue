<template>
  <fieldset>
    <legend class="text-base font-bold mb-1">{{ props.label }}</legend>
    <div class="flex gap-2">
      <YearMonthDropdown
        v-model="startValue"
        :placeholder="props.startPlaceholder"
        :label="props.startLabel"
        :start-date="props.startRangeDate"
        :end-date="props.endRangeDate"
      />
      <YearMonthDropdown
        v-model="endValue"
        :placeholder="props.endPlaceholder"
        :label="props.endLabel"
        :start-date="props.startRangeDate"
        :end-date="props.endRangeDate"
      />
    </div>
  </fieldset>
</template>

<script setup lang="ts">
const startValue = defineModel<string>('start')
const endValue = defineModel<string>('end')

type Props = {
  label: string
  startRangeDate: Date
  endRangeDate: Date
  startLabel: string
  endLabel: string
  startPlaceholder: string
  endPlaceholder: string
}

const props = defineProps<Props>()
</script>

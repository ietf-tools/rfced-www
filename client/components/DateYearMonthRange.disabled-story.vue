<template>
  <Story
    title="DateYearMonthRange"
    :layout="{
      type: 'grid',
      width: 500
    }"
  >
    <span class="text-black">
      <DateYearMonthRange
        v-model:start="startValue"
        v-model:end="endValue"
        :start-range-date="OLDEST_RFC"
        :end-range-date="NEWEST_POTENTIAL_RFC"
        label="Publication date"
        start-label="from"
        start-placeholder="Date from"
        end-label="to"
        end-placeholder="Date to"
      />
    </span>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const startValue = ref('2020-1')
const endValue = ref('2023-3')

const OLDEST_RFC = new Date('1969-01-01').toUTCString()
const NEWEST_POTENTIAL_RFC = new Date().toUTCString()
</script>

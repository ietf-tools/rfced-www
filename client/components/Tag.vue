<template>
  <div
    :class="[
      'pointer-events-none inline-flex items-center bg-blue-200 dark:bg-blue-800 text-white text-xs uppercase font-semibold [clip-path:polygon(0%_50%,_6%_0%,_96%_0%,100%_50%,96%_100%,6%_100%)]',
      props.class
    ]"
  >
    <span class="pl-5 pr-2 py-2 whitespace-nowrap">
      {{ props.tag.type }}
    </span>
    <span
      class="bg-yellow-400 dark:bg-yellow-700 dark:text-white text-black pl-2 pr-5 py-2"
    >
      {{ formatDate(props.tag.date) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

type Props = {
  tag: {
    type: string
    date: Date
  }
  class?: string
}

function formatDate(date: Date) {
  const luxonDate = DateTime.fromJSDate(date)
  return luxonDate.toRelativeCalendar()
}

const props = defineProps<Props>()
</script>

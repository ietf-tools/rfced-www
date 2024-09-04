<template>
  <div
    class="bg-white dark:bg-black relative dark:border-2 pl-5 pr-7 py-4 rounded"
  >
    <Heading :level="props.headingLevel">
      <a
        v-if="props.href"
        :href="props.href"
        :class="[
          'block text-[22px] font-bold text-blue-300 dark:text-blue-100 no-underline focus:underline hover:underline group',
          props.hasCoverLink &&
            'before:absolute before:content-[\'\'] before:inset-0 z-100'
        ]"
      >
        <slot name="headingTitle">slot #headingTitle</slot>
        <ChevronGraphic
          width="14"
          height="21"
          class="absolute right-4 bottom-4 text-gray-200 group-hover:text-gray-400 group-hover:transition-all group-hover:right-3 -rotate-90"
        />
      </a>
    </Heading>
    <slot />
  </div>
</template>

<script setup lang="ts">
type Props = {
  hasCoverLink?: boolean
  href?: string
  headingLevel: '1' | '2' | '3' | '4' | '5' | '6'
}

const props = defineProps<Props>()
</script>

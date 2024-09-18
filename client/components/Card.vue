<template>
  <div
    class="bg-white dark:bg-black relative dark:border-2 pl-5 pr-7 py-4 rounded"
  >
    <Heading :level="props.headingLevel">
      <a
        :href="props.href"
        :class="[
          'block text-[22px] font-bold text-blue-300 dark:text-blue-100 no-underline focus:underline hover:underline group',
          props.hasCoverLink &&
            'before:absolute before:content-[\'\'] before:inset-0 before:z-50 before:transition-all hover:before:shadow-xl focus:before:shadow-xl'
        ]"
      >
        <slot name="headingTitle">slot #headingTitle</slot>
        <span
          v-if="!props.hasCoverLink"
          class="block absolute right-0 w-10 h-full top-0"
        >
          <!-- for a larger click area -->
        </span>
        <GraphicsChevron
          width="14"
          height="21"
          :class="[
            'absolute right-4 text-gray-200 group-hover:text-blue-400 group-focus:text-blue-400 transition-all group-hover:right-3 group-focus:right-3 -rotate-90',
            props.chevronPosition === 'center' ? 'bottom-[50%]' : 'bottom-4'
          ]"
        />
      </a>
    </Heading>
    <slot />
  </div>
</template>

<script setup lang="ts">
type Props = {
  headingLevel: '1' | '2' | '3' | '4' | '5' | '6'
  hasCoverLink?: boolean
  href?: string
  chevronPosition?: 'center' | 'end'
}

const props = withDefaults(defineProps<Props>(), { chevronPosition: 'end' })
</script>

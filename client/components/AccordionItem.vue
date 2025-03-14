<template>
  <Accordion.Item :value="props.id">
    <Accordion.ItemTrigger
      class="flex flex-row w-full justify-between items-center py-1 border border-gray-500 hover:bg-white/10"
    >
      <span
        :class="{
          'p-4': styleDepth === 1,
          'px-6 py-3': styleDepth === 2
        }"
        >{{ props.triggerText }}</span
      >
      <Accordion.ItemIndicator
        class="w-[16px] border-l border-gray-500 py-4 pl-6 pr-8 text-blue-100"
      >
        <GraphicsChevron class="-rotate-90" data-chevron />
      </Accordion.ItemIndicator>
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <slot />
    </Accordion.ItemContent>
  </Accordion.Item>
</template>

<script setup lang="ts">
import { Accordion } from '@ark-ui/vue'

type Props = {
  /**
   * Text of the button to toggle the accordion item
   */
  triggerText: string | VNode
  id: string
  /**
   * Styles the accordion at a certain nesting depth. ie, an accordion
   * within another accordion would have styleDepth=2
   */
  styleDepth?: 1 | 2
}

const props = withDefaults(defineProps<Props>(), { styleDepth: 1 })
</script>

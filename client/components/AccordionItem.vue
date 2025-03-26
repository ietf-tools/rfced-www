<template>
  <AccordionItem v-slot="{ open }" :value="props.id">
    <AccordionHeader>
      <AccordionTrigger
        class="flex flex-row w-full justify-between items-center py-1 p border border-gray-500 hover:bg-white/10"
      >
        <span
          :class="{
            'p-4': props.styleDepth === 1,
            'px-6 py-3': props.styleDepth === 2
          }"
        >
          {{ props.triggerText }}
        </span>
        <GraphicsChevron
          :class="{
            'mr-4 size-4': true,
            '-rotate-180': !open
          }"
        />
      </AccordionTrigger>
    </AccordionHeader>
    <AccordionContent>
      <slot />
    </AccordionContent>
  </AccordionItem>
</template>

<script setup lang="ts">
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger
} from 'reka-ui'

type Props = {
  /**
   * Text of the button to toggle the accordion item
   */
  triggerText: string | VNode
  id: string
  /**
   * Styles the accordion at a certain nesting depth. ie, an accordion
   * within another accordion would have styleDepth=2 and be styled
   * differently (smaller).
   */
  styleDepth?: 1 | 2
}

const props = withDefaults(defineProps<Props>(), { styleDepth: 1 })
</script>

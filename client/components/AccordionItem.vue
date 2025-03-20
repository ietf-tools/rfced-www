<template>
  <Disclosure v-slot="{ open }">
    <DisclosureButton
      class="flex flex-row w-full justify-between items-center py-1 p border border-gray-500 hover:bg-white/10"
    >
      <span
        :class="{
          'p-4': styleDepth === 1,
          'px-6 py-3': styleDepth === 2
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
    </DisclosureButton>
    <DisclosurePanel>
      <slot />
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'

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

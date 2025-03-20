<template>
  <div
    :class="[
      'pointer-events-none inline-flex items-center bg-blue-400 dark:bg-blue-800 print:bg-white text-white print:text-black text-base print:text-sm uppercase font-semibold',
      props.class,
      {
        'screen:[clip-path:polygon(0%_50%,_6%_0%,_96%_0%,100%_50%,96%_100%,6%_100%)]':
          totalTextLength < 5,
        'screen:[clip-path:polygon(0%_50%,_10%_0%,_90%_0%,100%_50%,90%_100%,10%_100%)]':
          totalTextLength >= 5 && totalTextLength <= 10,
        'screen:[clip-path:polygon(0%_50%,_5%_0%,_95%_0%,100%_50%,95%_100%,5%_100%)]':
          totalTextLength > 10 && totalTextLength <= 15,
        'screen:[clip-path:polygon(0%_50%,_4%_0%,_96%_0%,100%_50%,96%_100%,4%_100%)]':
          totalTextLength > 15
      }
    ]"
  >
    <template v-if="props.text.length === 1">
      <span class="px-3 py-1 print:px-0 whitespace-nowrap inline-block px-2">
        <Renderable :val="props.text[0]" />
      </span>
    </template>
    <template v-else-if="props.text.length === 2">
      <span class="pl-5 pr-2 py-2 print:p-0 whitespace-nowrap">
        <Renderable :val="props.text[0]" />
      </span>
      <span
        class="bg-yellow-200 dark:bg-yellow-700 dark:text-white text-black print:text-black pl-2 pr-5 py-2 print:py-0"
      >
        <Renderable :val="props.text[1]" />
      </span>
    </template>
    <template v-else>
      <!-- you'll have to add support for this yourself -->
      {{ props.text }}
    </template>
  </div>
</template>

<script setup lang="ts">
import { getVNodeText } from '~/utilities/vue'
import type { VueStyleClass } from './VueUtils'

type Props = {
  text: (string | VNode)[]
  class?: VueStyleClass
}

const props = defineProps<Props>()

const totalTextLength = computed(() => {
  return props.text.reduce((acc, item): number => {
    return (
      acc + (typeof item === 'string' ? item.length : getVNodeText(item).length)
    )
  }, 0)
})
</script>

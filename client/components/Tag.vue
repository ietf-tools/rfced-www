<template>
  <div
    :class="[
      'pointer-events-none inline-flex items-center bg-blue-200 dark:bg-blue-800 text-white text-xs uppercase font-semibold',
      props.class,
      {
        '[clip-path:polygon(0%_50%,_6%_0%,_96%_0%,100%_50%,96%_100%,6%_100%)]':
          totalTextLength < 5,
        '[clip-path:polygon(0%_50%,_10%_0%,_90%_0%,100%_50%,90%_100%,10%_100%)]':
          totalTextLength >= 5 && totalTextLength <= 10,
        '[clip-path:polygon(0%_50%,_7%_0%,_93%_0%,100%_50%,93%_100%,7%_100%)]':
          totalTextLength > 10 && totalTextLength <= 15,
        '[clip-path:polygon(0%_50%,_5%_0%,_95%_0%,100%_50%,95%_100%,5%_100%)]':
          totalTextLength > 15
      }
    ]"
  >
    <template v-if="props.text.length === 1">
      <span class="px-3 py-1 whitespace-nowrap">
        <template v-if="typeof props.text[0] === 'string'">
          {{ props.text[0] }}
        </template>
        <template v-else>
          <component :is="props.text[0]" />
        </template>
      </span>
    </template>
    <template v-else-if="props.text.length === 2">
      <span class="pl-5 pr-2 py-2 whitespace-nowrap">
        <template v-if="typeof props.text[0] === 'string'">
          {{ props.text[0] }}
        </template>
        <template v-else>
          <component :is="props.text[0]" />
        </template>
      </span>
      <span
        class="bg-yellow-400 dark:bg-yellow-700 dark:text-white text-black pl-2 pr-5 py-2"
      >
        <template v-if="typeof props.text[1] === 'string'">
          {{ props.text[1] }}
        </template>
        <template v-else>
          <component :is="props.text[1]" />
        </template>
      </span>
    </template>
    <template v-else>
      <!-- you'll have to add support for this yourself -->
      {{ props.text }}
    </template>
  </div>
</template>

<script setup lang="ts">
type Props = {
  text: (string | ReturnType<typeof h>)[]
  class?: string
}

const props = defineProps<Props>()

// Is this safe? It seems to work
function getText(obj: ReturnType<typeof h>): string {
  if (typeof obj === 'string') {
    return obj
  } else if (typeof obj.children === 'string') {
    return obj.children
  } else if (Array.isArray(obj.children)) {
    return obj.children
      .map((item) => getText(item as ReturnType<typeof h>))
      .join('')
  }
  return ''
}

const totalTextLength = computed(() =>
  props.text.reduce((acc, item): number => {
    return acc + (typeof item === 'string' ? item.length : getText(item).length)
  }, 0)
)
</script>

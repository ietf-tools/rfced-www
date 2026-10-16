<template>
  <ul class="flex flex-col gap-4 computedHeadingWidth">
    <li v-for="rfc in list" :key="rfc.number" class="flex flex-col">
      <RFCCardSearchItem heading-level="3" :rfc="rfc" :density="searchStore.density" show-abstract show-tag-date />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { calculateMaxHeadingCharWidth } from '~/utilities/rfc-title'
import type { TypeSenseSearchItem } from '../utilities/typesense'
import { typeSenseSearchItemToRFCCommon } from '~/utilities/rfc-converters'

type Props = {
  items: TypeSenseSearchItem[]
}

const props = defineProps<Props>()

const list = computed(() =>
  props.items.map((typesenseSearchItem) => typeSenseSearchItemToRFCCommon(typesenseSearchItem))
)

const maxHeadingWidth = ref(calculateMaxHeadingCharWidth(list.value))

watchDebounced(
  () => list,
  () => {
    maxHeadingWidth.value = calculateMaxHeadingCharWidth(list.value)
  },
  {
    debounce: 200,
    maxWait: 400,
    immediate: true,
    deep: true
  }
)

const searchStore = useSearchStore()
</script>

<style global>
.computedHeadingWidth {
  --computed-heading-char-length: v-bind(maxHeadingWidth);
}
</style>

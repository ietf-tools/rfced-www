<template>
  <RFCCard
    v-if="density === 'full'"
    :rfc="rfc"
    :show-abstract="props.showAbstract"
    :show-tag-date="props.showTagDate"
  />
  <RFCCardDense
    v-else-if="density === 'dense'"
    heading-level="3"
    :rfc="rfc"
    :show-abstract="false"
    :show-tag-date="props.showTagDate"
  />
  <RFCCardCompact
    v-else-if="density === 'compact'"
    :rfc="rfc"
    :show-abstract="props.showAbstract"
    :show-tag-date="props.showTagDate"
  />
</template>

<script setup lang="ts">
import { typeSenseSearchItemToRFC } from '~/utilities/typesense'
import type { Density, TypeSenseSearchItem } from '~/utilities/typesense'

type Props = {
  typeSenseSearchItem: TypeSenseSearchItem
  showAbstract?: boolean
  showTagDate?: boolean
  density: Density
}

const props = defineProps<Props>()

const rfc = computed(() => typeSenseSearchItemToRFC(props.typeSenseSearchItem))
</script>

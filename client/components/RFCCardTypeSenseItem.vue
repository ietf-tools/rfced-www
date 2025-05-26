<template>
  <RFCCard
    heading-level="3"
    :rfc="rfc"
    :show-abstract="props.showAbstract"
    :show-tag-date="props.showTagDate"
  />
</template>

<script setup lang="ts">
import { typeSenseSearchItemToRFC } from '~/utilities/typesense'
import type { TypeSenseSearchItem } from '~/utilities/typesense'

type Props = {
  typeSenseSearchItem: TypeSenseSearchItem
  showAbstract?: boolean
  showTagDate?: boolean
}

const props = defineProps<Props>()

const rfc = computed(() => typeSenseSearchItemToRFC(props.typeSenseSearchItem))
</script>

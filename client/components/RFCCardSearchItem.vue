<template>
  <RFCCard
    heading-level="3"
    :rfc="rfc"
    :show-abstract="props.showAbstract"
    :show-tag-date="props.showTagDate"
  />
</template>

<script setup lang="ts">
import type { RfcMetadata } from '../generated/red-client'
import { rfcMetadataToRfc } from '~/utilities/rfc'

type Props = {
  searchItem: RfcMetadata
  showAbstract?: boolean
  showTagDate?: boolean
}

const props = defineProps<Props>()

const rfc = rfcMetadataToRfc(props.searchItem)
</script>

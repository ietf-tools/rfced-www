<template>
  <Story title="RFC Card">
    <RFCCard :rfc="rfcCommon" heading-level="3" />
  </Story>
</template>

<script setup lang="ts">
import { rfcToRfcCommon } from '~/utilities/rfc-converters'
import { exampleRfc } from '~/utilities/rfc.mocks'

const rfcCommon = rfcToRfcCommon(exampleRfc)
</script>

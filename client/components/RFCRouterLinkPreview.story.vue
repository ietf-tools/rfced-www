<template>
  <Story title="RFC Router Link Preview: fixed background">
    <RFCRouterLinkPreview :rfc-json="exampleRfcJson" :is-fixed="true" />
  </Story>
</template>

<script setup lang="ts">
import { rfcToRfcJSON } from '~/utilities/rfc-converters'
import { exampleRfc } from '~/utilities/rfc.mocks'

const exampleRfcJson = rfcToRfcJSON(exampleRfc)
</script>

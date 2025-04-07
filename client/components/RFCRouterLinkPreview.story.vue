<template>
  <Story title="RFC Router Link Preview: fixed background">
    <RFCRouterLinkPreview :rfc-json="exampleRfcJson" :is-fixed="true" />
  </Story>
</template>

<script setup lang="ts">
import { exampleRfc } from '~/utilities/rfc.mocks'
import { rfcToRfcJSON } from '~/utilities/rfc'

const exampleRfcJson = rfcToRfcJSON(exampleRfc)
</script>

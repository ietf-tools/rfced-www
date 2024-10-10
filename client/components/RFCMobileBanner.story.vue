<template>
  <Story title="RFC Mobile Banner">
    <RFCMobileBanner :rfc-id="rfcId" :is-fixed="true" />
  </Story>
</template>

<script setup lang="ts">
import { parseRFCId } from './rfc'

const rfcId = parseRFCId('RFC1234')
</script>

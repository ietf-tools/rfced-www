<template>
  <Story title="RFC Mobile Banner">
    <RFCMobileBanner :rfc="exampleRfc" :is-fixed="true" />
  </Story>
</template>

<script setup lang="ts">
import { exampleRfc } from './rfc.test'
</script>

<template>
  <Story title="RFC Card">
    <RFCCard :rfc="exampleRfc" heading-level="3" />
  </Story>
</template>

<script setup lang="ts">
import { exampleRfc } from '~/utilities/rfc'
</script>

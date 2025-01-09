<template>
  <Story title="RFC Document">
    <RFCDocument :rfc="exampleRfc" />
  </Story>
</template>

<script setup lang="ts">
import { exampleRfc } from '~/utilities/rfc.mocks'
</script>

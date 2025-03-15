<template>
  <Accordion.Root multiple collapsible>
    <slot />
  </Accordion.Root>
</template>

<script setup lang="ts">
import { Accordion } from '@ark-ui/vue'
</script>

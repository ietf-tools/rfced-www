<template>
  <AMaybeRfcLink v-bind="props">
    <slot />
  </AMaybeRfcLink>
</template>

<script setup lang="ts">
import type { AnchorProps } from '~/utilities/html'

const props = defineProps<AnchorProps>()
</script>

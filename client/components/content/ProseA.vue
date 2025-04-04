<template>
  <AMaybeRfcLink v-bind="props">
    <slot />
  </AMaybeRfcLink>
</template>

<script setup lang="ts">
import AMaybeRfcLink from '../AMaybeRFCLink.vue'
import type { AnchorProps } from '~/utilities/html'

const props = defineProps<AnchorProps>()
</script>

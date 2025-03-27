<template>
  <A v-bind="props">
    <slot />
  </A>
</template>

<script setup lang="ts">
import type { AnchorProps } from '~/utilities/html'

const props = defineProps<AnchorProps>()
</script>

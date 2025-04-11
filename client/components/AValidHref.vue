<template>
  <AMaybeRFCLink v-bind="props">
    <slot />
  </AMaybeRFCLink>
</template>

<script setup lang="ts">
import type { AnchorProps } from '~/utilities/html'
import type { ValidHrefs } from '~/utilities/url'

type AnchorPropsWithValidHref = Omit<AnchorProps, 'href'> & { href: ValidHrefs }

/**
 * TypeScript wrapper for A.vue that attempts to detect valid hrefs
 */
const props = defineProps<AnchorPropsWithValidHref>()
</script>

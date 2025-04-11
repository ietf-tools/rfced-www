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
 * TypeScript wrapper for links that attempts to detect invalid/valid hrefs as TypeScript failures
 */
const props = defineProps<AnchorPropsWithValidHref>()
</script>

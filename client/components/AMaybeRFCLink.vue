<template>
  <component
    :is="isInternal && isRfcLink ? RFCRouterLink : Anchor"
    v-bind="props"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * Detects links to RFCs (eg `/rfc/rfc9001.pdf`) and uses RFCRouterLink instead
 *
 * with a fallback to Anchor
 */
import { computed } from 'vue'
import RFCRouterLink from './RFCRouterLink.vue'
import Anchor from './A.vue'
import type { AnchorProps } from '~/utilities/html'
import { isInternalLink, parseMaybeRfcLink } from '~/utilities/url'

const props = defineProps<AnchorProps>()
const isInternal = computed(() => isInternalLink(props.href))
const isRfcLink = computed(() => !!parseMaybeRfcLink(props.href))
</script>

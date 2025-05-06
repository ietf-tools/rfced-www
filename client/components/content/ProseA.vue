<template>
  <RFCRouterLink v-if="isInternal && isRfcLink" v-bind="$attrs">
    <slot />
  </RFCRouterLink>
  <Anchor v-else v-bind="$attrs">
    <slot />
  </Anchor>
</template>

<script setup lang="ts">
/**
 * Detects links to RFCs (eg `/rfc/rfc9001.pdf`) and uses RFCRouterLink instead
 *
 * with a fallback to Anchor
 */
import RFCRouterLink from '../RFCRouterLink.vue'
import Anchor from '../A.vue'
import { isInternalLink, parseMaybeRfcLink } from '~/utilities/url'

const props = defineProps<{ href?: string; id?: string }>()
const isInternal = isInternalLink(props.href)
const isRfcLink = !!parseMaybeRfcLink(props.href)
</script>

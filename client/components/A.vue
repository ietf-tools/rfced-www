<template>
  <component :is="isInternal ? NuxtLink : 'a'" v-bind="sanitisedAnchorProps">
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * An anchor hyperlink that detects whether to use SPA Vue Router or a conventional hyperlink.
 *
 * If you want to ALSO detect RFC links and display a preview use AMaybeRFCLink.vue
 */
import { computed } from 'vue'
import { NuxtLink } from '#components'
import { EXTERNAL_LINK_REL, TARGET_NEW_WINDOW } from '~/utilities/html'
import type { AnchorProps } from '~/utilities/html'
import { isInternalLink, isMailToLink } from '~/utilities/url'

const props = defineProps<AnchorProps>()

const isInternal = computed(() => isInternalLink(props.href))
const isMailTo = computed(() => isMailToLink(props.href))

const sanitisedAnchorProps = computed(() => ({
  ...props,
  to: isInternal.value ? props.href : undefined, // copy `href` to `to` for NuxtLink
  rel:
    props.rel ??
    (!isInternal.value && !isMailTo.value ? EXTERNAL_LINK_REL : undefined),
  target:
    props.target ??
    (!isInternal.value && !isMailTo.value ? TARGET_NEW_WINDOW : undefined)
}))
</script>

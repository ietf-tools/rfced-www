<template>
  <HoverCardRoot v-model:open="isOpen">
    <HoverCardTrigger>
      <RouterLink
        v-bind="propsWithHrefAsTo"
        @focus="loadRfc"
        @mouseover="loadRfc"
        @blur="isOpen = false"
      >
        <slot />
      </RouterLink>
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent
        class="border-2 shadow-xl rounded-md max-w-xs bg-white dark:bg-black border-black dark:border-gray-100"
      >
        <RFCRouterLinkPreview v-if="rfcJSON" :rfc-json="rfcJSON" />
        <p
          v-else
          class="p-3 w-full text-center"
          aria-live="polite"
          aria-atomic="true"
        >
          Loading...
        </p>
        <HoverCardArrow />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>

<script setup lang="ts">
import { computed, onUnmounted } from 'vue'
import {
  HoverCardArrow,
  HoverCardContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger
} from 'reka-ui'
import { RouterLink } from 'vue-router'
import type { AnchorProps } from '~/utilities/html'
import { RFC_TYPE_RFC } from '~/utilities/rfc'
import type { RFCJSON } from '~/utilities/rfc'
import { parseMaybeRfcLink, rfcJSONPathBuilder } from '~/utilities/url'
import RFCRouterLinkPreview from './RFCRouterLinkPreview.vue'

const props = defineProps<AnchorProps>()

const rfcJSON = ref<RFCJSON | undefined>()
const isLoading = ref<boolean>(false)
const isOpen = ref<boolean>(false) // manually controlling open so that we can have keyboard access for sighted users

let attemptsRemaining = 2
let hasUnmountedAbortController = new AbortController()

onUnmounted(() => {
  hasUnmountedAbortController?.abort()
})

const propsWithHrefAsTo = computed(() => ({
  ...props,
  to: props.href // copy `href` to `to` for vue-router RouterLink usage
}))

/**
 * Loads RFC JSON for the link preview
 */
const loadRfc = async (): Promise<void> => {
  // This is intentionally client-side only. There should be no SSR calling this function.
  // TODO: deduplicate requests for same RFC across components? Not sure if the added
  // complexity is worth it. Currently we're relying on browser network cache which seems fine.
  if (hasUnmountedAbortController.signal.aborted) {
    // The component has unmounted so we can ignore requests to load this RFC
    return
  }
  if (rfcJSON.value) {
    // Data already loaded so we can ignore requests to load it again
    return
  }
  if (isLoading.value === true) {
    // A request is currently inflight so we don't need to try again. This is expected behaviour because the
    // mouseover and focus events could be fired multiple times before a request completes
    return
  }

  const rfcId = parseMaybeRfcLink(props.href)
  if (rfcId === undefined || rfcId.type !== RFC_TYPE_RFC) {
    console.warn(
      `Received "${props.href}" which wasn't parsed as having an rfc id. Ignoring.`
    )
    return
  }

  const rfcJSONPath = rfcJSONPathBuilder(`rfc${rfcId.number}`)

  if (attemptsRemaining <= 0) {
    console.log('Giving up after multiple failed requests for ', rfcJSONPath)
    return
  }

  attemptsRemaining--
  isLoading.value = true // no async behaviour (awaits) should occur before this is set to true
  console.log(`Loading ${rfcJSONPath}`)
  let data: RFCJSON | undefined = undefined
  try {
    const response = await fetch(rfcJSONPath, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (hasUnmountedAbortController.signal.aborted) {
      return
    }
    if (!response.ok) {
      console.error(
        `Bad response was HTTP ${response.status} ${response.statusText}`,
        response,
        `Going to retry ${attemptsRemaining} time(s)`
      )
      setTimeout(loadRfc, 0)
      return
    }

    data = await response.json()
    if (!data) {
      console.error(
        `Bad JSON from response HTTP ${response.status} ${response.statusText}`,
        response,
        `Going to retry ${attemptsRemaining} time(s)`
      )
      setTimeout(loadRfc, 0)
      return
    }
  } catch (e) {
    console.error(e)
    // Could be a transient network failure, try again soon
    isLoading.value = false
    setTimeout(loadRfc, 0)
    return
  }

  isLoading.value = false
  rfcJSON.value = data
  isOpen.value = true
}
</script>

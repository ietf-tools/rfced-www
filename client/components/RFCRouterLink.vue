<template>
  <HoverCardRoot v-model:open="isHoverCardOpen">
    <HoverCardTrigger>
      <RouterLink
        v-bind="propsWithHrefAsTo"
        @focus="loadRfc"
        @mouseover="loadRfc"
        @blur="isHoverCardOpen = false"
      >
        <slot />
      </RouterLink>
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent
        class="w-[300px] h-[225px] border shadow-2xl overflow-x-hidden rounded-md max-w-xs bg-white dark:bg-black border-gray-400 dark:border-white px-2 data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all"
      >
        <div v-if="rfcJSON">
          <div
            v-if="rfcId"
            class="mx-auto sticky top-0 z-2 block w-50 px-4 pt-1 pb-2 mb-4 text-center bg-gray-200 dark:bg-gray-700 rounded-b-xl"
          >
            <component :is="formatTitle(`rfc${rfcId.number}`)" />
            Preview
          </div>
          <RFCRouterLinkPreview :rfc-json="rfcJSON" />
        </div>
        <p
          v-else
          class="p-3 w-full text-center"
          aria-live="polite"
          aria-atomic="true"
        >
          Loading...
        </p>

        <HoverCardArrow class="fill-gray-200 stroke-gray-500 -mt-[1px]" />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
  <div class="inline-block md:hidden">
    <DialogRoot v-model:open="isDialogOpen">
      <DialogTrigger
        class="ml-1 px-1 align-baseline"
        @focus="loadRfc"
        @mouseover="loadRfc"
      >
        <Icon name="fluent:preview-link-16-regular" aria-label="Link Preview" />
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          class="data-[state=open]:animate-enterFromBottom rounded-t-xl data-[state=closed]:animate-exitToBottom fixed w-full h-[50vh] bottom-0 left-0 shadow-[0_-5px_25px_rgba(0,0,0,0.25)] dark:shadow-[0_-5px_25px_rgba(11,140,197,0.25)] text-black bg-white dark:bg-black dark:text-white border-t-1 border-gray-400 dark:border-gray-600 overflow-y-scroll"
        >
          <DialogClose :class="`fixed right-0 py-[10px] px-3 pb-3`">
            <GraphicsClose />
          </DialogClose>
          <DialogTitle
            class="mx-auto sticky top-0 z-2 block w-50 px-4 pt-1 pb-2 mb-6 text-center bg-gray-200 dark:bg-gray-700 rounded-b-xl"
          >
            <span v-if="rfcId">
              <component :is="formatTitle(`rfc${rfcId.number}`)" />
              Preview
            </span>
          </DialogTitle>
          <DialogDescription class="max-w-md mx-auto px-4">
            <RFCRouterLinkPreview v-if="rfcJSON" :rfc-json="rfcJSON" />
            <p
              v-else
              class="p-3 w-full text-center"
              aria-live="polite"
              aria-atomic="true"
            >
              Loading...
            </p>
          </DialogDescription>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, customRef } from 'vue'
import { RouterLink } from 'vue-router'
import RFCRouterLinkPreview from './RFCRouterLinkPreview.vue'
import type { AnchorProps } from '~/utilities/html'
import { formatTitle, RFC_TYPE_RFC } from '~/utilities/rfc'
import type { RFCJSON } from '~/utilities/rfc'
import { parseMaybeRfcLink, rfcJSONPathBuilder } from '~/utilities/url'

const props = defineProps<AnchorProps>()

const rfcJSON = ref<RFCJSON | undefined>()
const isLoading = ref<boolean>(false)
const isDialogOpen = ref<boolean>(false)
const isHoverCardOpen = (() => {
  let value: boolean = false
  return customRef((track, trigger) => ({
    get() {
      track()
      // we never want to open the hovercard while the dialog is open
      return isDialogOpen.value ? false : value
    },
    set(newValue) {
      value = newValue
      trigger()
    }
  }))
})()

const rfcId = parseMaybeRfcLink(props.href)

let attemptsRemaining = 2
const hasUnmountedAbortController = new AbortController()

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
    // The component has already unmounted so we can ignore requests to load this RFC
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
  console.log(`Loaded ${rfcJSONPath}`)

  isLoading.value = false
  rfcJSON.value = data
}
</script>

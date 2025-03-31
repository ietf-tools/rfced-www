<template>
  <RouterLink
    v-if="!maybeRfcJson"
    v-bind="propsWithHrefAsTo"
    @focus="loadRfc"
    @blur="doNotAutoDisplay"
    @mouseover="loadRfc"
    @mouseout="doNotAutoDisplay"
  >
    <slot />
  </RouterLink>
  <TooltipProvider v-else>
    <TooltipRoot :delay-duration="0" :default-open="defaultOpen">
      <TooltipTrigger>
        <RouterLink v-bind="propsWithHrefAsTo">
          <slot />
        </RouterLink>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          class="p-2 max-w-[300px] border rounded-md bg-white dark:bg-black border-black dark:border-white text-black dark:text-white"
        >
          <b class="m-0 p-0">{{ maybeRfcJson.title }}</b>
          <p class="m-0 p-0 leading-none">{{ maybeRfcJson.abstract }}</p>
          <TooltipArrow />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<script setup lang="ts">
import { computed, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import type { AnchorProps } from '~/utilities/html'
import { RFC_TYPE_RFC } from '~/utilities/rfc'
import type { RFCJSON } from '~/utilities/rfc'
import { parseMaybeRfcLink, rfcJSONPathBuilder } from '~/utilities/url'

const props = defineProps<AnchorProps & { to: string }>()

const maybeRfcJson = ref<RFCJSON | undefined>()

const defaultOpen = ref<boolean>(false)

const doNotAutoDisplay = () => (defaultOpen.value = false)

const isLoading = ref<boolean>(false)

let timer: ReturnType<typeof setTimeout> | undefined = undefined
let attemptsRemaining = 5

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})

const propsWithHrefAsTo = computed(() => ({
  ...props,
  // Although copying `href` to `to` is already done in A.vue, any direct usage of RFCRouterLink would need this
  to: props.to ?? props.href // copy `href` to `to` for vue-router RouterLink usage
}))

const loadRfc = async (): Promise<void> => {
  defaultOpen.value = true

  if (attemptsRemaining <= 0) {
    console.log('Giving up after multiple failed requests')
    return
  }
  if (maybeRfcJson.value) {
    console.log('Data already loaded')
    return
  }
  if (isLoading.value) {
    console.log('Ignoring multiple requests for JSON')
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

  let data: RFCJSON | undefined = undefined
  try {
    // This is intentionally client-side only. There should be no SSR calling this function.
    // TODO: deduplicate requests for same RFC across components? Not sure if the added
    // complexity is worth it. Currently we're relying on browser network cache which seems fine.
    const response = $fetch<RFCJSON | undefined>(rfcJSONPath, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    isLoading.value = true
    attemptsRemaining--
    data = await response
    if (!data) {
      throw Error('No data returned')
    }
  } catch (e) {
    console.error(e)
    // Could be a transient network failure, try again soon
    isLoading.value = false
    timer = setTimeout(loadRfc, 0)
    return
  }

  isLoading.value = false
  maybeRfcJson.value = data
}
</script>

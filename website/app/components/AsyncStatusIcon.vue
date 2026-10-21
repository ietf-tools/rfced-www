<template>
  <span class="inline-block w-6 h-6 shrink-0">
    <span class="relative block w-full h-full">
      <span class="sr-only" role="status" aria-atomic="true">{{ progressAnnouncement }}</span>
      <span class="sr-only" role="alert" aria-atomic="true">{{ errorAnnouncement }}</span>
      <span aria-hidden="true" class="absolute inset-0 block">
        <Transition
          appear
          enter-active-class="transition-opacity duration-300 motion-reduce:transition-none"
          leave-active-class="transition-opacity duration-300 motion-reduce:transition-none"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0">
          <GraphicsLoading
            v-if="visual === 'loading'"
            class="absolute inset-0 w-full h-full text-blue-300 dark:text-blue-100" />
          <GraphicsCheckmark
            v-else-if="visual === 'success'"
            class="absolute inset-0 w-full h-full text-green-700 dark:text-green-300" />
          <GraphicsDismiss
            v-else-if="visual === 'error'"
            class="absolute inset-0 w-full h-full text-red-700 dark:text-red-300" />
        </Transition>
      </span>

      <PopoverRoot v-if="visual === 'error' || isRetrying" :open="isPopoverOpen" @update:open="onUpdateOpen">
        <PopoverTrigger
          type="button"
          :aria-disabled="isRetrying"
          :aria-label="isRetrying ? `Retrying ${label}` : `Problem updating ${label}. Show details`"
          class="absolute inset-0 rounded-full cursor-pointer aria-disabled:cursor-progress focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 dark:focus-visible:outline-blue-100" />
        <PopoverPortal>
          <PopoverContent
            side="bottom"
            align="end"
            :side-offset="6"
            class="z-120 max-w-xs rounded-md border border-gray-400 bg-white dark:bg-black p-3 text-sm shadow-3xl focus:outline-none data-[state=open]:animate-slideUpAndFade motion-reduce:animate-none">
            <p>{{ errorAnnouncement }}</p>
            <button
              type="button"
              class="mt-2 px-3 py-1 rounded-md cursor-pointer text-white bg-blue-600 dark:bg-blue-900 border border-gray-400"
              @click="onRetry">
              Try again
            </button>
            <PopoverArrow class="fill-white dark:fill-black stroke-gray-400" />
          </PopoverContent>
        </PopoverPortal>
      </PopoverRoot>
    </span>
  </span>
</template>

<script setup lang="ts">
/**
 * The state of one async task in the space of a single icon: a spinner while loading, then a tick
 * or a cross. The cross opens a popover with the error and a way to retry.
 */
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { useAsyncStatusIcon } from '~/utilities/async-status-icon'
import type { LoadingStatus } from '~/utilities/loading-status'

type Props = {
  status: LoadingStatus
  /** The thing being updated, as it reads after "Updating", e.g. "your subscription". */
  label: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ retry: [] }>()

const { status, label } = toRefs(props)
const { visual, progressAnnouncement, errorAnnouncement, isRetrying, retry } = useAsyncStatusIcon(status, label)

const isPopoverOpen = ref(false)

const onUpdateOpen = (open: boolean) => {
  if (!isRetrying.value) {
    isPopoverOpen.value = open
  }
}

const onRetry = () => {
  isPopoverOpen.value = false
  retry()
  emit('retry')
}
</script>

<template>
  <div>
    <div role="status" aria-atomic="true">
      <AlertBox class="inline-block" v-if="visual === 'loading' || visual === 'success'" variant="info">
        <p class="flex items-center gap-2">
          <GraphicsLoading v-if="visual === 'loading'" aria-hidden="true" class="inline-block w-5 h-5 shrink-0" />
          <GraphicsCheckmark
            v-else
            aria-hidden="true"
            class="inline-block w-5 h-5 shrink-0 text-green-700 dark:text-green-300" />
          {{ visual === 'loading' ? messages.loading : messages.success }}
        </p>
      </AlertBox>
    </div>

    <AlertBox v-if="visual === 'error'" variant="warning" role="alert">
      <p>{{ errorMessage }}</p>
    </AlertBox>
  </div>
</template>

<script setup lang="ts">
/**
 * The state of one async task as a message in an AlertBox: the loading text while it runs, then
 * the success text, which fades after a moment, or the error. The caller supplies the wording so
 * the same component can say "Saving..." in one place and something else elsewhere.
 */
import { useAsyncStatusIcon } from '~/utilities/async-status-icon'
import type { LoadingStatus } from '~/utilities/loading-status'

type Props = {
  status: LoadingStatus
  messages: {
    loading: string
    success: string
  }
}

const props = defineProps<Props>()

const { status } = toRefs(props)
// Text takes longer to read than a tick takes to notice.
const SUCCESS_MESSAGE_VISIBLE_MS = 5000

const { visual, errorAnnouncement: errorMessage } = useAsyncStatusIcon(status, '', {
  successVisibleMs: SUCCESS_MESSAGE_VISIBLE_MS
})
</script>

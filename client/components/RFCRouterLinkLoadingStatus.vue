<template>
  <p
    class="p-3 w-full text-center"
    :aria-live="props.loadingStatus.type === 'error' ? 'assertive' : 'polite'"
    aria-atomic="true"
  >
    <template v-if="props.loadingStatus.type === 'idle'"></template>
    <template v-if="props.loadingStatus.type === 'loading'">
      Loading...
    </template>
    <template v-if="props.loadingStatus.type === 'error'">
      Error: {{ props.loadingStatus.message }}
    </template>
  </p>
</template>

<script setup lang="ts">
import type { LoadingStatus } from '~/utilities/loading-status'

type Props = {
  loadingStatus: LoadingStatus
}

const props = defineProps<Props>()
</script>

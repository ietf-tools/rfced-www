<template>
  <div
    :class="[
      props.isFixed && 'fixed bottom-0 left-0 right-0 lg:hidden',
      'flex flex-row w-full justify-between items-center py-1 bg-[#002D3CE5] text-white dark:bg-black dark:border'
    ]"
  >
    <div
      :class="[
        props.isFixed && 'container mx-auto',
        !props.isFixed && 'p-2',
        'xs:leading-5 sm:leading-6'
      ]"
    >
      <div class="font-bold">
        {{ props.rfcId.type }} {{ props.rfcId.number }}
      </div>
      <div v-if="props.rfcId.type === RFC">Internet Standard</div>
      <div class="text-red-400">Obsoleted by RFC 9052 CBOR</div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { RFC } from './rfc'
import type { parseRFCId } from './rfc'

type Props = {
  isFixed: boolean
  rfcId: ReturnType<typeof parseRFCId>
}

const props = defineProps<Props>()
</script>

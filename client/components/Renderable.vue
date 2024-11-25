<template>
  <template v-if="isVNode(val)">
    <component :is="val" />
  </template>
  <template v-else>
    {{ val }}
  </template>
</template>

<script setup lang="ts">
import { isVNode } from 'vue'
import type { VNode } from 'vue'

type Props = {
  val: string | VNode
}

defineProps<Props>()
</script>

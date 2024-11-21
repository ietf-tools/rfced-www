<template>
  <template v-if="isVNode(val)">
    <component :is="val" />
  </template>
  <template v-else>
    {{ val }}
  </template>
</template>

<script setup>
import { isVNode } from 'vue'

defineProps({
  /**
   * Definitions of columns and their labels
   **/
  val: {
    type: [String, Object],
    required: true
  }
})
</script>

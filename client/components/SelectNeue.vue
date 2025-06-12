<template>
  <span
    class="inline-block outline-1 rounded-xs outline-gray-400 focus-within:ring-black focus-within:ring-offset-4 focus-within:ring-2"
  >
    <select
      v-bind="$attrs"
      :class="['focus:ring-none focus:outline-none py-2 mx-4', props.class]"
    >
      <slot />
    </select>
  </span>
</template>

<script setup lang="ts">
/**
 * A <select> that appears to have internal padding so that the native <select> dropdown icon 'v' will be padded from
 * the edge.
 *
 * This works by disabling the native <select> focus ring, and using 'focus-within' from a container with spacing.
 *
 * Usage of this component should wrap it in a <label> because the area outside the <select> isn't focusable, but the
 * <label> will make it so.
 */

import type { VueStyleClass } from '~/utilities/vue'

type Props = {
  class?: VueStyleClass
}

const props = defineProps<Props>()
</script>

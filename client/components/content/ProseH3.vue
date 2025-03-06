<template>
  <Heading :id="props.id" level="3" class="pt-3 pb-1">
    <a v-if="generate" :href="`#${props.id}`">
      <slot />
    </a>
    <slot v-else />
  </Heading>
</template>

<script setup lang="ts">
// Note, initially copied from https://github.com/nuxt-modules/mdc/blob/main/src/runtime/components/prose/ProseH3.vue

import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(
  () =>
    props.id &&
    ((typeof headings?.anchorLinks === 'boolean' &&
      headings?.anchorLinks === true) ||
      (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h1))
)
</script>

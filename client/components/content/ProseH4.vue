<template>
  <Heading :id="props.id" :has-internal-link="true" level="4" class="pt-3 pb-1">
    <slot />
  </Heading>
</template>

<script setup lang="ts">
// Note, initially copied from https://github.com/nuxt-modules/mdc/blob/main/src/runtime/components/prose/ProseH4.vue
// probably worth reviewing the source during an upgrade to see if there are any changes we should adopt
const props = defineProps<{ id?: string }>()
</script>

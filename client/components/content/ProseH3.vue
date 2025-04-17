<template>
  <Heading level="3" class="pt-3 pb-1" :id="props.id" :has-internal-link="true">
    <slot />
  </Heading>
</template>

<script setup lang="ts">
// Note, initially copied from https://github.com/nuxt-modules/mdc/blob/main/src/runtime/components/prose/ProseH3.vue
// probably worth reviewing the source during an upgrade to see if there are any changes we should adopt
const props = defineProps<{ id?: string }>()
</script>

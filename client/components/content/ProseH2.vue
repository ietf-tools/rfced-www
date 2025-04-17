<template>
  <Heading level="2" class="pt-4 pb-2" :has-internal-link="true" :id="props.id">
    <slot />
  </Heading>
</template>

<script setup lang="ts">
// Note, initially copied from https://github.com/nuxt-modules/mdc/blob/main/src/runtime/components/prose/ProseH2.vue
// probably worth reviewing the source during an upgrade to see if there are any changes we should adopt
const props = defineProps<{ id?: string }>()
</script>

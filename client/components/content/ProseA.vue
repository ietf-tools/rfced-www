<template>
  <NuxtLink :href="props.href" :target="props.target">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
// Note, initially copied from https://github.com/nuxt-modules/mdc/blob/main/src/runtime/components/prose/ProseA.vue

type Props = {
  href: string
  target?: '_blank' | '_parent' | '_self' | '_top'
}

const props = withDefaults(defineProps<Props>(), {
  href: '',
  target: undefined
})
</script>

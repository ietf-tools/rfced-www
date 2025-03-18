<template>
  <a :href="props.href">
    <i><slot /></i>
  </a>
</template>

<script setup lang="ts">
type Props = {
  href: string
}

const props = defineProps<Props>()
</script>

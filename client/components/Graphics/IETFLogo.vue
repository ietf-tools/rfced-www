<template>
  <img
    :src="ietfLogo"
    :width="props.width"
    :height="props.height"
    :class="props.class"
    alt="Internet Engineering Task Force"
  />
</template>

<script setup lang="ts">
import ietfLogo from 'assets/ietf-nor-dense-inverted-duotone.svg'

type Props = {
  width: string
  height: string
  class?: string
}

const props = defineProps<Props>()
</script>

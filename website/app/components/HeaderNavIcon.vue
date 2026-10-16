<template>
  <component v-if="props.icon && typeof props.icon === 'string'" :is="resolveGraphicsIcon(props.icon)" />
  <component v-else-if="props.icon && typeof props.icon === 'function'" :is="props.icon" />
</template>

<script setup lang="ts">
import type { MenuItem } from './HeaderNavData'
import { resolveGraphicsIcon } from '~/utilities/graphics-icon'

type Props = {
  icon?: MenuItem['icon']
}

const props = defineProps<Props>()
</script>

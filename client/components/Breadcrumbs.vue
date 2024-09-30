<template>
  <ul class="block mt-1 -ml-2 mb-3 px-1 xs:px-0">
    <li
      v-for="(path, index) in props.breadcrumbItems"
      :key="index"
      class="inline-block"
    >
      <a
        class="inline-block px-2 py-2 rounded hover:bg-gray-200 hover:text-blue-800"
        :href="path.url"
      >
        {{ path.label }}
      </a>
      <template v-if="index >= 0 && index < props.breadcrumbItems.length - 1">
        <GraphicsChevron
          class="inline-block -rotate-90 text-gray-300"
          width="14"
          height="18"
        />
      </template>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from './BreadcrumbsTypes'

type Props = {
  breadcrumbItems: BreadcrumbItem[]
}

const props = defineProps<Props>()
</script>

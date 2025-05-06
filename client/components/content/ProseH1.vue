<template>
  <Heading
    v-bind="$attrs"
    level="1"
    class="pt-10 pb-3"
    :has-internal-link="false"
  >
    <slot />
  </Heading>
  <TableOfContentsMarkdownMobile
    v-if="tocInjection?.showToc && tocInjection?.toc"
    :toc="tocInjection?.toc"
  />
  <span v-else> {{ tocInjection }} </span>
</template>

<script setup lang="ts">
import { tocKey } from '../../utilities/tableOfContents'

const tocInjection = inject(tocKey)
</script>

<template>
  <div
    class="hidden lg:sticky lg:top-[3px] lg:flex lg:flex-col lg:min-w-[300px] p-2"
  >
    <TableOfContentsHighlight
      :toc="props.toc"
      list-type="ordered"
      wrapper-class="h-[calc(100vh-24px)] pb-2"
      list-class="mr-1"
      nested-list-class="pl-1"
      :list-item-class="`block text-sm py-2 border-t-1 border-t-gray-300 dark:border-t-gray-500 no-underline hover:underline ${ANCHOR_TAILWIND_STYLE}`"
      list-item-active-class="text-shadow-bold"
    >
      <Heading level="2" style-level="5" class="mb-1 text-gray-800 dark:text-gray-300">
        In this section
      </Heading>
    </TableOfContentsHighlight>
  </div>
</template>

<script setup lang="ts">
import type { RfcEditorToc } from '~/utilities/tableOfContents'
import { ANCHOR_TAILWIND_STYLE } from '~/utilities/theme';

type Props = {
  toc: RfcEditorToc
}

const props = defineProps<Props>()
</script>

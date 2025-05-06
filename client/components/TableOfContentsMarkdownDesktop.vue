<template>
  <div
    class="hidden lg:sticky lg:top-[3px] lg:flex border-1 dark:border-gray-700 border-gray-300 lg:flex-col md:w-[400px] lg:w-[400px] p-2"
  >
    <TableOfContentsHighlight
      :toc="props.toc"
      list-type="ordered"
      wrapper-class="h-[calc(100vh-24px)] pb-2"
      list-class="mr-1"
      nested-list-class="pl-1"
      list-item-class="block px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
      list-item-active-class="text-shadow-bold bg-gray-200 dark:bg-gray-800"
    >
      <Heading level="2" style-level="5" class="mb-1 pl-3">
        Table of Contents
      </Heading>
    </TableOfContentsHighlight>
  </div>
</template>

<script setup lang="ts">
import type { RfcEditorToc } from '~/utilities/tableOfContents'

type Props = {
  toc: RfcEditorToc
}

const props = defineProps<Props>()
</script>

<template>
  <div class="lg:hidden">
    <TableOfContents
      :toc="props.toc"
      list-type="ordered"
      list-class="list-disc"
      nested-list-class="list-disc pl-5"
      list-item-class="block py-1 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
    >
      <Heading level="2" style-level="5" class="mb-1 pl-3">
        Table of Contents
      </Heading>
    </TableOfContents>
  </div>
</template>

<script setup lang="ts">
import type { RfcEditorToc } from '~/utilities/tableOfContents'

type Props = {
  toc: RfcEditorToc
}

const props = defineProps<Props>()
</script>

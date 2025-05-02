<template>
  <div
    class="hidden lg:sticky lg:top-[3px] lg:flex border-1 border-gray-300 lg:flex-col md:w-[400px] lg:w-[400px] p-2"
  >
    <TableOfContentsHighlight :toc="toc" list-type="ordered">
      <Heading level="2" class="m-0 pl-3">Table of Contents</Heading>
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

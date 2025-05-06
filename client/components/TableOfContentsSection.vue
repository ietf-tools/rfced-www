<template>
  <component
    :is="listTypeElement"
    :class="[
      props.depth === 0 && props.listClass,
      props.depth >= 1 && props.nestedListClass
    ]"
  >
    <li v-for="section in props.sections" :key="section.id">
      <NuxtLink :to="`#${section.id}`" :class="props.listItemClass">
        {{ section.title }}
      </NuxtLink>

      <TableOfContentsSection
        v-if="section.sections"
        :sections="section.sections"
        :list-type-element="listTypeElement"
        :depth="props.depth + 1"
        :list-class="props.listClass"
        :nested-list-class="props.nestedListClass"
        :list-item-class="props.listItemClass"
      />
    </li>
  </component>
</template>

<script setup lang="ts">
/**
 * Table of Contents
 *
 * See also TableOfContentsHighlight.vue
 */
import type { RfcEditorToc } from '../utilities/tableOfContents'

type Sections = RfcEditorToc['sections']

type Props = {
  sections: Sections
  listTypeElement: 'ol' | 'ul'
  depth: number
  listClass?: string
  nestedListClass?: string
  listItemClass?: string
}

const props = defineProps<Props>()
</script>

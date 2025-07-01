<template>
  <component
    :is="props.listTypeElement"
    :class="[
      props.depth === 0 && props.listClass,
      props.depth >= 1 && props.nestedListClass
    ]"
  >
    <li v-for="(section, index) in props.sections" :key="index">
      <NuxtLink
        v-for="(link, linkIndex) in section.links"
        :key="linkIndex"
        :id="makeTocId(link.id)"
        :to="`#${link.id}`"
        :aria-current="link.id === props.activeId"
        :class="[
          props.listItemClass,
          activeId === link.id && props.listItemActiveClass,
          'flex flex-row justify-between'
        ]"
        @click="handleClick(link.id)"
      >
        <span>
          {{ link.title }}
        </span>
      </NuxtLink>

      <GraphicsChevron
        class="shrink-0 grow-0 basis-5 w-1.5 h-1.5 text-blue-100 group-hover:text-white ml-1 translate-y-1.5 -rotate-90"
      />

      <TableOfContentsHighlightSection
        v-if="section.sections"
        :sections="section.sections"
        :list-type-element="listTypeElement"
        :depth="props.depth + 1"
        :active-id="props.activeId"
        :handle-click="props.handleClick"
        :make-toc-id="props.makeTocId"
        :is-ssr="props.isSsr"
        :list-class="props.listClass"
        :nested-list-class="props.nestedListClass"
        :list-item-class="props.listItemClass"
        :list-item-active-class="props.listItemActiveClass"
      />
    </li>
  </component>
</template>

<script setup lang="ts">
/**
 * Table of Contents that highlights titles that are in the viewport
 */

import type { RfcEditorToc } from '../utilities/tableOfContents'

type Sections = RfcEditorToc['sections']

type Props = {
  sections: Sections
  listTypeElement: 'ol' | 'ul'
  depth: number
  activeId: string
  handleClick: (id: string) => void
  makeTocId: (id: string) => string
  isSsr: boolean
  listClass?: string
  nestedListClass?: string
  listItemClass?: string
  listItemActiveClass?: string
}

const props = defineProps<Props>()
</script>

<template>
  <component :is="listTypeElement">
    <li v-for="section in props.value.sections" :key="section.id">
      <NuxtLink
        :to="`#${section.id}`"
        :class="{
          'p-2': true
        }"
      >
        {{ section.title }}
      </NuxtLink>

      <component
        v-if="section.sections"
        :is="listTypeElement"
        class="pt-0 pl-4"
      >
        <li v-for="subSection in section.sections" :key="subSection.id">
          <NuxtLink :to="`#${subSection.id}`">
            {{ subSection.title }}
          </NuxtLink>
        </li>
      </component>
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

type Props = {
  value: RfcEditorToc
  listType: 'numbered' | 'ordered'
}

const props = defineProps<Props>()

const listTypeElement = computed(() =>
  props.listType === 'numbered' ? 'ol' : 'ul'
)
</script>

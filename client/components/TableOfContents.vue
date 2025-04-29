<template>
  <component :is="listTypeElement">
    <li v-for="(section, index) in props.value.sections" :key="section.id">
      <NuxtLink
        @click="setActive(section.id)"
        :to="`#${section.id}`"
        :aria-current-value="section.id === activeId"
        :class="{
          'p-2': true,
          'bg-black text-white ':
            (isSSR && index === 0) || activeId === section.id
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
          <NuxtLink
            @click="setActive(subSection.id)"
            :to="`#${subSection.id}`"
            :aria-current-value="subSection.id === activeId"
            :class="{ 'bg-black text-white': activeId === subSection.id }"
          >
            {{ subSection.title }}
          </NuxtLink>
        </li>
      </component>
    </li>
  </component>
</template>

<script setup lang="ts">
import { useActiveScroll } from 'vue-use-active-scroll'
import type { RfcEditorToc } from '../utilities/tableOfContents'

type Props = {
  value: RfcEditorToc
  listType: 'numbered' | 'ordered'
}

const props = defineProps<Props>()

const listTypeElement = computed(() =>
  props.listType === 'numbered' ? 'ol' : 'ul'
)

type Section = RfcEditorToc['sections'][number]

const flattenSections = (section: Section): string[] =>
  [section.id].concat(
    section.sections ? section.sections.flatMap(flattenSections) : []
  )

const ids = computed(() => props.value.sections.flatMap(flattenSections))

if (
  // safety check in case there's a coding error
  // because if we pass non-strings to useActiveScroll then it will crash the page
  ids.value.some((id) => typeof id !== 'string')
) {
  throw createError({
    statusCode: 500,
    statusMessage: `Server error. Please try again later. Toc ids were not string. Was: ${JSON.stringify(ids.value.map((id) => typeof id))}`,
    fatal: true
  })
}

const { setActive, activeId } = useActiveScroll(ids)

const isSSR = ref(true)
onMounted(() => (isSSR.value = false))
</script>

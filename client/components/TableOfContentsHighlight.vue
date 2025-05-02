<template>
  <div ref="wrapperRef" class="h-[calc(100vh-16px)] overflow-y-auto">
    <slot />
    <component :is="listTypeElement">
      <li v-for="(section, index) in props.toc.sections" :key="section.id">
        <NuxtLink
          @click="setActive(section.id)"
          :to="`#${section.id}`"
          :id="makeTocId(section.id)"
          :aria-current="section.id === activeId"
          :class="{
            'block px-3 py-1 text-sm rounded': true,
            'bg-gray-200 text-black text-shadow-bold text-shadow-lg':
              (isSSR && index === 0) || activeId === section.id
          }"
        >
          {{ section.title }}
        </NuxtLink>

        <component v-if="section.sections" :is="listTypeElement" class="pt-0">
          <li v-for="subSection in section.sections" :key="subSection.id">
            <NuxtLink
              @click="setActive(subSection.id)"
              :to="`#${subSection.id}`"
              :id="makeTocId(subSection.id)"
              :aria-current="subSection.id === activeId"
              :class="{
                'block px-3 py-1 text-sm rounded': true,
                'bg-gray-200 text-black text-shadow-bold text-shadow-lg':
                  activeId === subSection.id
              }"
            >
              {{ subSection.title }}
            </NuxtLink>
          </li>
        </component>
      </li>
    </component>
  </div>
</template>

<script setup lang="ts">
/**
 * Table of Contents that highlights titles that are in the viewport
 */
import { watch } from 'vue'
import { useActiveScroll } from 'vue-use-active-scroll'
import type { RfcEditorToc } from '../utilities/tableOfContents'
import { prefersReducedMotion } from '~/utilities/accessibility'

type Props = {
  toc: RfcEditorToc
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

const ids = computed(() => props.toc.sections.flatMap(flattenSections))

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

const wrapperRef = ref<HTMLElement>()

const makeTocId = (id: string) => `toc-${id}`

const SCROLL_BUFFER_PX = 100

watch(activeId, () => {
  // console.log('*** activeId changed', activeId.value)
  const { value: wrapper } = wrapperRef
  const tocLink = document.getElementById(makeTocId(activeId.value))
  if (!tocLink || !wrapper) {
    console.log('*** no tocLink/wrapper found', { tocLink, wrapper })
    return
  }

  const tocLinkRect = tocLink.getBoundingClientRect()
  const wrapperRect = wrapper.getBoundingClientRect()

  const isVisible =
    tocLinkRect.top >= wrapperRect.top + SCROLL_BUFFER_PX &&
    tocLinkRect.bottom <= wrapperRect.bottom - SCROLL_BUFFER_PX

  if (isVisible) {
    return
  }

  const targetTopPx =
    wrapper.scrollTop +
    // top can be negative
    Math.abs(tocLinkRect.top) -
    wrapper.offsetHeight / 2

  console.log('*** targettop', {
    targetTopPx,
    'wrapper.scrollTop': wrapper.scrollTop,
    'tocLinkRect.top': tocLinkRect.top,
    'Math.abs(tocLinkRect.top)': Math.abs(tocLinkRect.top),
    'wrapperRect.height / 2': wrapperRect.height / 2
  })

  /**
   * Before changing this scroll behaviour be sure to use the FAQ page as a test,
   * and test scrolling all the way up and down and ensure it scrolls revealing
   * the very last and first item
   *
   * Be sure to test with a very short browser window (height about 200px)
   *
   * I tried using scrollIntoView but it was jittery in Chrome/Firefox
   *
   *  tocLink.scrollIntoView({
   *    behavior: 'smooth',
   *    block: 'nearest',
   *    inline: 'nearest'
   *  })
   *
   */

  wrapper.scrollTo({
    top: targetTopPx,
    behavior: prefersReducedMotion() ? 'instant' : 'smooth'
  })
})

const isSSR = ref(true)
onMounted(() => (isSSR.value = false))
</script>

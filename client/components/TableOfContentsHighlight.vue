<template>
  <div ref="wrapperRef" :class="['overflow-y-auto', props.wrapperClass]">
    <slot />
    <TableOfContentsHighlightSection
      v-if="props.toc.sections"
      :sections="props.toc.sections"
      :depth="0"
      :list-type-element="listTypeElement"
      :active-id="activeId"
      :handle-click="handleClick"
      :make-toc-id="makeTocId"
      :is-ssr="isSSR"
      :list-class="props.listClass"
      :nested-list-class="props.nestedListClass"
      :list-item-class="props.listItemClass"
      :list-item-active-class="props.listItemActiveClass"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Table of Contents that highlights titles that are in the browser viewport
 */
import { watch } from 'vue'
import { useActiveScroll } from 'vue-use-active-scroll'
import type { RfcEditorToc } from '../utilities/tableOfContents'
import { prefersReducedMotion } from '~/utilities/accessibility'

type Section = RfcEditorToc['sections'][number]

type Props = {
  toc: RfcEditorToc
  listType: 'numbered' | 'ordered'
  wrapperClass?: string
  listClass?: string
  nestedListClass?: string
  listItemClass?: string
  listItemActiveClass?: string
}

const props = defineProps<Props>()

const listTypeElement = computed(() =>
  props.listType === 'numbered' ? 'ol' : 'ul'
)

const SCROLL_BUFFER_PX = 100
const wrapperRef = ref<HTMLElement>()

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

const { setActive: _setActive, activeId } = useActiveScroll(ids)

const handleClick = (id: string): void => {
  /**
   * After they click the `#id` link the page scrolls which recalculates the
   * activeId to something other than what they clicked, which means the wrong
   * TOC Link is highlighted and this is confusing UX.
   *
   * To fix this confusing UX we'll try to set the activeId a few times.
   * FIXME: This isn't great but it works.
   */
  _setActive(id)
  setTimeout(() => _setActive(id), 50)
  setTimeout(() => _setActive(id), 100)
  setTimeout(() => _setActive(id), 150)
}

onMounted(() => {
  /** FIXME: write a Playwright test for this and delete this
   *
   *  There have been subtle bugs in Vue rendering HTML that affect DOM ids,
   *  so --in the browser-- we check whether the ids given to useActiveScroll()
   *  actually exist.
   *
   *  There was a bug first noticed on the FAQ page, whose headings and ids come
   *  from markdown, but strictly speaking the bug could occur more generally
   *  if the ids given to this component don't exist.
   *
   *  For those wanting more detail about the bug...
   *
   *      There was a bug noticed first on the FAQ page where the '#' link
   *      was pointing to a missing heading id. There were two duplicate 'wg' DOM ids,
   *      and `Heading.vue` '#' link to `#errata` wasn't pointing anywhere.
   *
   *      As well as breaking the '#' link, this also broke useActiveScroll() because the
   *      id `errata` was missing.
   *
   *      But to make matters stranger `Heading.vue` renders from the same `id` prop and they
   *      were getting out of sync WITHIN the same component, so something with reactivity
   *      was broken. In both cases Heading.vue's template renders with
   *
   *          props.id ?? getAnchorId($slots.default)
   *
   *      so they should result in the same string, but apparently not!
   *
   *      We're using the `remark-heading-id` plugin to support the Markdown `{#id}` syntax,
   *      for custom ids needed on the FAQ page, so we have to pass that `id` attribute
   *      along.
   *
   *      The markdown renderer supports overriding renderers `components/content/Prose*.vue`
   *      and the anchor <a> override is `ProseA.vue`. We need ProseA.vue to override anchors
   *      to support RFC Link Previews.
   *
   *      When we don't override using ProseA.vue the bug disappears, so let's start there.
   *
   *      This test throws an exception if it finds missing ids, so it's easy to reload the
   *      page after trying a fix to see whether the bug is still present. Doing a manual
   *      bisect (ie deleting half the code until the bug goes away) I traced the bug to
   *      RFCRouterLink.vue and the line:
   *
   *         <div v-show="hasTouchStore.hasTouch === true" class="inline">
   *
   *      `v-show` means it will render the HTML to the DOM but selectively reveal it using CSS.
   *      Changing it to this fixed the bug,
   *
   *         <div v-if="hasTouchStore.hasTouch === true" class="inline">
   *
   *      Although this fixes the bug it doesn't explain why duplicate 'wg' ids would appear
   *      in Headings, or how `id` props got of sync within that component.
   *
   *      Perhaps something in Nuxt Content is caching and reusing VNodes incorrectly.
   *
   *  Anyway, devs using this component should provide valid ids so checking them (as a way
   *  of surfacing this bug) is what this test does.
   *
   */

  const problemIds = ids.value.filter((id) => {
    // returns problematic ids

    // DON'T REFACTOR THIS TO getElementById() because we're using querySelectorAll()
    // intentionally to query multiple identical ids, whereas getElementById would only
    // return 1 max.
    const targets = document.querySelectorAll(`#${id}`)

    if (targets.length === 0) {
      // PROBLEM FOUND: that id should exist in the DOM but it doesn't
      return true
    } else if (targets.length >= 2) {
      // PROBLEM FOUND: that id shouldn't exist 2+ times in the DOM
      return true
    }

    // else, it's ok
    return false
  })

  if (problemIds.length > 0) {
    const title = 'TableOfContentsHighlight.vue ids problem. Bad ids: '
    console.error(title, problemIds)
    throw Error(`${title} ${problemIds.join(', ')}`)
  } else {
    console.log('TableOfContentsHighlight.vue ids all found.')
  }
})

const makeTocId = (id: string) => `toc-${id}`

watch(activeId, () => {
  /**
   * Scrolls the TOC in an attempt to make the active item always visible to the user
   */
  const { value: wrapper } = wrapperRef
  const tocLink = document.getElementById(makeTocId(activeId.value))
  if (!tocLink || !wrapper) {
    console.error('No tocLink/wrapper found', { tocLink, wrapper })
    return
  }

  const tocLinkRect = tocLink.getBoundingClientRect()
  const wrapperRect = wrapper.getBoundingClientRect()

  const isVisible =
    tocLinkRect.top >= wrapperRect.top + SCROLL_BUFFER_PX &&
    tocLinkRect.bottom <= wrapperRect.bottom - SCROLL_BUFFER_PX

  if (isVisible) {
    // nothing to do
    return
  }

  const targetTopPx =
    wrapper.scrollTop +
    // top can be negative at the end of a scroll so we Math.abs() to ensure
    // a positive number because attempting to scroll too far is acceptable
    // at the end of a scroll
    Math.abs(tocLinkRect.top) -
    wrapper.offsetHeight / 2

  wrapper.scrollTo({
    top: targetTopPx,
    behavior: prefersReducedMotion() ? 'instant' : 'smooth'
  })
})

const isSSR = ref(true)
onMounted(() => (isSSR.value = false))
</script>

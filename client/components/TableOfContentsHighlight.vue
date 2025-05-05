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

onMounted(() => {
  if (!import.meta.dev) {
    console.log(
      'Not validating TableOfContentsHighlight.vue ids in this environment',
      import.meta.dev
    )
    return
  }

  /** FIXME: write a Playwright test for this and delete this onMounted() test.
   *
   *  There have been subtle bugs in Vue rendering HTML that affect DOM ids,
   *  so --in the browser-- we check whether the ids given to useActiveScroll()
   *  are actually in the page.
   *
   *  For context, there was a bug noticed first on the FAQ page where the '#' link
   *  was pointing to the wrong heading id. There were two duplicate 'wg' DOM ids,
   *  and `Heading.vue` '#'' link to #errata wasn't pointing anywhere. As well as
   *  breaking the '#' link, this also broke useActiveScroll() because 'errata' wasn't
   *  present.
   *
   *  The bug is not related to Markdown, but for those wanting more detail...
   *
   *      As an aside, the bug was to do with ProseA.vue reacting to the `id` attribute,
   *      We're using the `remark-heading-id` plugin to support the Markdown {#id} syntax.
   *      The markdown renderer supports overrides for rendering in
   *      `components/content/Prose*.vue` and the `ProseA.vue` override for <a> anchors
   *      wasn't passing `id` correctly somehow. The buggy previous code looked like
   *      https://github.com/ietf-tools/rfced-www/blob/2c7344554882aaf95577d920dcce30eb29730253/client/components/content/ProseA.vue
   *      When changed to a simple v-bind="$attrs" the bug was fixed.
   *
   *      The original reason for the custom `<a>` was for RFC Link Previews.
   *
   *      Best guess is that it because the `id` attribute wasn't reacting correctly,
   *      perhaps only in dev mode, and perhaps relating to @vue-ignore weirdness
   *      https://github.com/ietf-tools/rfced-www/blob/4d648ec74a5a94db16073b0b1363c42cea1b9913/client/utilities/html.ts#L21
   *      in the previous props to <A>.
   *
   *      But to make matters stranger `Heading.vue` renders from the same prop and they
   *      were getting out of sync wihin the same component, so something with reactivity
   *      was broken. Both parts of Heading.vue's template render with
   *      `props.id ?? getAnchorId($slots.default)` so they should result in the same
   *      string, but apparently not! Feel free to rewind to late April 2025 to see the
   *      bug for yourself.
   *
   *  Anyway, users of his component should provide valid ids so checking them (as a way
   *  of surfacing this bug) is what this code does.
   *
   */

  const problemIds = ids.value.filter((id) => {
    // returns problematic ids

    const targets = document.querySelectorAll(
      // DON'T REFACTOR THIS TO getElementById() because we're using querySelectorAll()
      // intentionally to query multiple identical ids, whereas getElementById would only
      // return 1 max.

      `#${
        id // `id` is safe to use as selectors (ie, no whitespace that would affect the selector is in it)
      }`
    )

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
    // top can be negative at the end of a scroll so we Math.abs() to ensure a positive number because attempting to scroll too far is fine at the end of a scroll
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

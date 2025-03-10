<template>
  <component
    :is="`h${level}`"
    :id="!disableInternalLink ? anchorId : undefined"
    :class="[headingStyles[`h${styleLevel || level}`], customClass, 'group']"
  >
    <GraphicsIETFMotif
      v-if="hasIcon"
      class="absolute ml-[-1.3em] -mt-4 print:hidden"
      width="75"
      height="55"
      :opacity="0.05"
    />
    <slot />
    <a
      v-if="!disableInternalLink && anchorId"
      :href="`#${anchorId}`"
      class="ml-2 opacity-50 no-underline group-hover:opacity-100"
      title="Link to this heading"
      >#</a
    >
  </component>
</template>

<script lang="ts">
/*

This Heading component can generate an HTML internal link target, eg
1. `id="internal-link"` on the heading element, and;
2. `<a href="#internal-link">#</a>` internal link in the heading

The DOM Id is derived from the text of the default <slot />. This text is reformatted into a
DOM Id (eg the text is kebab-cased to remove whitespace, but check the code for specifics).

In earlier versions of the Composition-style Heading component inspecting the default <slot />
caused a Vue warning:

  "Slot invoked outside of the render function
  this will not track dependencies used in the slot.
  Invoke the slot function inside the render function instead."

  See https://zelig880.com/how-to-fix-slot-invoked-outside-of-the-render-function-in-vue-3

So this is intentionally an 'Options' Vue component, not a 'Composition' setup Vue component, to work
around this issue.

TODO: refactor this back to Composition... someday
*/
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { kebabCase } from 'lodash-es'
import type { VueStyleClass } from './VueUtils'
import { getVNodeText } from '~/utilities/vue'

type Level = '1' | '2' | '3' | '4' | '5' | '6'

type Props = {
  /**
   * The heading level eg 1-6.
   */
  level: Level
  /**
   * By default the 'level' prop is also used for styling, but you can optionally override this
   * to have different styling to the actual HTML heading element.
   *
   * Eg `<h1>` element but with h3's styling.
   *
   * For accessibility reasons heading levels should be semantic per the page structure / hierarchy,
   * not necessarily based on font size.
   *
   * W3C: WCAG, WAI say:
   *    "Skipping heading ranks can be confusing and should be avoided where possible: Make sure
   *    that a `<h2>` is not followed directly by an `<h4>`, for example."
   *
   * See also
   *  * https://www.w3.org/TR/2012/NOTE-WCAG20-TECHS-20120103/G141
   *  * https://dequeuniversity.com/rules/axe/3.4/heading-order
   *  * https://dequeuniversity.com/rules/axe/3.0/page-has-heading-one
   */
  styleLevel?: Level
  class?: VueStyleClass
  hasIcon?: boolean
  disableInternalLink?: boolean
}

const headingStyles: Record<`h${Props['level']}`, string> = {
  /**
   * Do not add default margins/padding here. The headings are used in many different situations
   * that need different margins/padding.
   *
   * Instead pass in the `class` prop for margins/padding, or make a wrapper component if you want
   * more reuse.
   */
  h1: 'text-3xl lg:text-5xl font-bold',
  h2: 'text-2xl font-bold',
  h3: 'text-xl font-bold',
  h4: 'text-lg font-bold',
  h5: 'text-base font-bold',
  h6: 'text-base font-bold'
}

export default defineComponent({
  props: {
    level: { type: String as PropType<Level>, required: true },
    styleLevel: String as PropType<Level>,
    class: String as PropType<VueStyleClass>,
    hasIcon: Boolean as PropType<boolean>,
    disableInternalLink: Boolean as PropType<boolean>
  },
  setup(props, { slots }) {
    const anchorId = computed(() => {
      const defaultSlot = slots.default ? slots.default() : []
      const slotText = getVNodeText(defaultSlot)
      const slotTextNormalised = slotText.trim().toLowerCase() // otherwise kebabCase() will split works with casing like 'RFCs' into 'rf-cs'
      return slotTextNormalised ? kebabCase(slotTextNormalised) : undefined
    })

    return {
      disableInternalLink: props.disableInternalLink,
      customClass: props.class,
      hasIcon: props.hasIcon,
      level: props.level,
      styleLevel: props.styleLevel,

      anchorId,
      headingStyles
    }
  }
})
</script>

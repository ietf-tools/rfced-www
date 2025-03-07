<template>
  <component
    :is="`h${props.level}`"
    :id="props.hasInternalLink ? anchorId : undefined"
    :class="[
      headingStyles[`h${props.styleLevel || props.level}`],
      props.class,
      'group'
    ]"
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
      v-if="props.hasInternalLink && anchorId"
      :href="`#${anchorId}`"
      class="ml-2 opacity-50 no-underline group-hover:opacity-100"
      title="Link to this heading"
      >#</a
    >
  </component>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'
import { kebabCase } from 'lodash-es'
import type { VueStyleClass } from './VueUtils'
import { getVNodeText } from '~/utilities/vue'

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
  hasInternalLink?: boolean
}

const slots = useSlots()
const defaultSlot = slots.default ? slots.default() : []

console.log(
  'slots',
  Object.keys(slots),
  Object.keys(slots.default),
  typeof slots.default,
  slots.default._n,
  slots.default._c,
  slots.default._d
)

const slotText = getVNodeText(defaultSlot)
const slotTextNormalised = slotText.trim().toLowerCase() // otherwise kebabCase() will split works with casing like 'RFCs' into 'rf-cs'
const anchorId = slotTextNormalised ? kebabCase(slotTextNormalised) : undefined

type Level = '1' | '2' | '3' | '4' | '5' | '6'

const props = defineProps<Props>()

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
</script>

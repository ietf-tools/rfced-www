<template>
  <component
    :is="`h${props.level}`"
    :class="[props.class, headingStyles[`h${props.styleLevel || props.level}`]]"
  >
    <GraphicsIETFMotif
      v-if="hasIcon"
      class="absolute ml-[-1.3em] -mt-4"
      width="75"
      height="55"
      :opacity="0.05"
    />
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { VueStyleClass } from './VueUtils'

type Props = {
  level: Level
  /**
   * By default the 'level' prop is also used for styling, but you can optionally override this
   * to have different styling to the actual HTML heading element.
   * Eg `<h1>` element but with h3's styling.
   *
   * For accessibility reasons heading levels should be semantic per the page structure / hierarchy,
   * not necessarily based on font size.
   *
   * W3C: WCAG, WAI say:
   * > "Skipping heading ranks can be confusing and should be avoided where possible: Make sure
   * > that a `<h2>` is not followed directly by an `<h4>`, for example."
   *
   * See also
   * * https://www.w3.org/TR/2012/NOTE-WCAG20-TECHS-20120103/G141
   * * https://dequeuniversity.com/rules/axe/3.4/heading-order
   * * https://dequeuniversity.com/rules/axe/3.0/page-has-heading-one
   */
  styleLevel?: Level
  class?: VueStyleClass
  hasIcon?: boolean
}

type Level = '1' | '2' | '3' | '4' | '5' | '6'

const props = defineProps<Props>()

const headingStyles: Record<`h${Props['level']}`, string> = {
  h1: 'text-3xl lg:text-5xl font-bold',
  h2: 'text-2xl font-bold',
  h3: 'text-xl font-bold',
  h4: 'text-lg font-bold',
  h5: 'text-base font-bold',
  h6: 'text-base font-bold'
}
</script>

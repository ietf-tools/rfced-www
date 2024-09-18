<template>
  <component
    :is="`h${props.level}`"
    :class="[
      props.class,
      headingStyles[`h${props.styleLevel || props.level}`],
      'text-grey-100'
    ]"
  >
    <GraphicsIETFMotif
      v-if="hasIcon"
      class="absolute ml-[-1.3em] -mt-4"
      width="75"
      height="55"
      :opacity="0.1"
    />
    <slot />
  </component>
</template>

<script setup lang="ts">
type Props = {
  level: Level
  /**
   * By default the 'level' prop is also used for styling, but you can override this
   * to have different styling to the actual HTML heading level element. Eg choose
   * <h1> but with h3's styling. Heading levels should be semantic per the page structure,
   * not necessarily based on font size.
   */
  styleLevel?: Level
  class?: string
  hasIcon?: boolean
}

type Level = '1' | '2' | '3' | '4' | '5' | '6'

const props = defineProps<Props>()

const headingStyles: Record<`h${Props['level']}`, string> = {
  h1: 'text-5xl font-bold',
  h2: 'text-2xl mt-7 mb-5 font-bold',
  h3: 'text-xl font-bold',
  h4: 'text-lg font-bold',
  h5: 'text-base font-bold',
  h6: 'text-xs font-bold'
}
</script>

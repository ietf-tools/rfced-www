<template>
  <component
    :is="`h${props.level}`"
    :class="[headingStyles[`h${props.level}`], 'text-grey-100', props.class]"
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
  level: '1' | '2' | '3' | '4' | '5' | '6'
  class?: string
  hasIcon?: boolean
}

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

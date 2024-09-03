<template>
  <svg
    :width="props.width"
    :height="props.height"
    viewBox="130 0 1190 1"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="['pointer-events-none', props.class]"
  >
    <g :opacity="props.opacity">
      <rect
        x="528.128"
        y="-313"
        width="296.708"
        height="746.886"
        transform="rotate(45 528.128 -133)"
        fill="currentColor"
      />
      <rect
        x="753.214"
        y="-88"
        width="296.708"
        height="473.832"
        transform="rotate(45 753.214 102.32)"
        fill="currentColor"
      />
      <rect
        x="979.621"
        y="140"
        width="296.708"
        height="261.464"
        transform="rotate(45 979.621 337.641)"
        fill="currentColor"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
type Props = {
  width?: string
  height?: string
  class?: string
  opacity: number
}

const props = withDefaults(defineProps<Props>(), {
  width: '20',
  height: '20',
  opacity: 1
})
</script>

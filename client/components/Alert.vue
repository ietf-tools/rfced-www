<template>
  <div
    :class="[
      'rounded border border-l-4 px-3 py-2 my-5 print:border-black print:bg-white',
      props.variant === 'warning' &&
        'bg-pink-100 dark:bg-red-950 border-red-600',
      props.variant === 'info' &&
        'bg-white dark:bg-yellow-950 border-yellow-400'
    ]"
  >
    <Heading
      :level="props.level"
      style-level="4"
      :class="[
        'print:border-black print:text-black',
        props.variant === 'warning' && 'text-red-700 dark:text-red-200',
        props.variant === 'info' && 'text-yellow-750 dark:text-yellow-300'
      ]"
    >
      {{ props.heading }}
    </Heading>
    <slot />
  </div>
</template>

<script setup lang="ts">
type Props = {
  level?: '1' | '2' | '3' | '4' | '5' | '6'
  variant: 'warning' | 'info'
  heading: string
}

const props = withDefaults(defineProps<Props>(), { level: '2' })
</script>

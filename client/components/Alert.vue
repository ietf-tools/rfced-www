<template>
  <div
    :class="[
      'rounded border border-l-4 px-3 py-2 my-5 ',
      props.variant === 'warning' &&
        'bg-pink-100 dark:bg-red-950 border-red-600',
      props.variant === 'info' &&
        'bg-white dark:bg-yellow-950 border-yellow-400'
    ]"
  >
    <Heading
      level="2"
      style-level="4"
      :class="[
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
  variant: 'warning' | 'info'
  heading: string
}

const props = defineProps<Props>()
</script>

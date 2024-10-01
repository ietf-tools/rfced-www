<template>
  <Story
    title="Card"
    :layout="{
      type: 'grid',
      width: 200
    }"
  >
    <Variant title="Regular card" :init-state="initState">
      <Card href="/sdf" heading-level="3" has-cover-link>
        <template #headingTitle>What is an RFC?</template>
        <p class="text-base mt-2 text-blue-900 dark:text-white">
          Short description of the page here if it seems useful to show
        </p>
      </Card>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import Card from './Card.vue'

function initState() {
  return {
    disabled: false
  }
}
</script>

<template>
  <Card :href="props.id" heading-level="3" has-cover-link>
    <template #headingTitle>{{ page?.title }} {{ error }}</template>
    <p v-if="summary" class="text-base mt-2 text-blue-900 dark:text-white">
      {{ summary }}
    </p>
  </Card>
</template>

<script setup lang="ts">
import type { markdownPathBuilder } from '~/utilities/url'

type ValidMarkdownPaths = Parameters<typeof markdownPathBuilder>[0]

type Props = {
  id: ValidMarkdownPaths
}
const props = defineProps<Props>()

const { error, data: page } = await useAsyncData(props.id, () =>
  queryCollection('content').path(props.id).first()
)

const summary = page.value?.summary
</script>

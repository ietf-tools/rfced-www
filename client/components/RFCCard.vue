<template>
  <Card
    :href="props.href"
    heading-level="3"
    has-cover-link
    :chevron-position="props.abstract ? 'center' : 'end'"
  >
    <template #headingTitle>
      <component :is="formatTitle(props.title)" />
    </template>
    <p class="text-base mt-2 text-blue-900 dark:text-white">
      <slot />
    </p>
    <div class="my-4">
      <Tag :tag="props.tag" />
    </div>
    <ul v-if="props.body" class="text-sm text-blue-900 dark:text-white">
      <li v-for="(part, index) in props.body" :key="index" class="inline">
        <GraphicsDiamond v-if="index > 0" />{{ part }}
      </li>
    </ul>
    <ul v-if="props.footer" class="text-xs text-gray-800 mt-1 dark:text-white">
      <li v-for="(part, index) in props.footer" :key="index" class="inline">
        <GraphicsDiamond v-if="index > 0" />{{ part }}
      </li>
    </ul>
    <div v-if="props.abstract" class="mt-6">
      <Heading
        level="4"
        style-level="5"
        class="text-blue-900 pt-3 border-t inline-block"
      >
        Abstract
      </Heading>
      <p class="leading-snug text-gray-800">{{ props.abstract }}</p>
    </div>
  </Card>
</template>

<script setup lang="ts">
type Props = {
  title: string
  href?: string
  tag: {
    type: string
    date: Date
  }
  headingLevel: '1' | '2' | '3' | '4' | '5' | '6'
  body?: string[]
  footer?: string[]
  abstract?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'RFC0000'
})

const formatTitle = (title: string) => {
  // split by groups of letters or numbers
  // ie "RFC0000" becomes ["RFC", "0000"]
  const parts = title.match(/\d+|\D+/g)
  if (parts === null) {
    return title
  }

  return h(
    'span',
    parts.map((part) => {
      if (part.match(/\d+/)) {
        return h('span', part.toString())
      }
      return h('span', { class: 'font-normal' }, part.toString())
    })
  )
}
</script>

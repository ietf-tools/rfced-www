<template>
  <Card
    :href="props.href"
    heading-level="3"
    :has-cover-link="responsiveModeStore.responsiveMode === 'Desktop'"
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
    <template v-if="props.abstract">
      <div class="block lg:hidden">
        <!-- mobile abstract -->
        <button
          type="button"
          :aria-expanded="isMobileAbstractOpen"
          :aria-controls="abstractDomId"
          class="text-blue-800 underline text-sm"
          @click="isMobileAbstractOpen = !isMobileAbstractOpen"
        >
          <span v-if="isMobileAbstractOpen">Hide abstract</span>
          <span v-else>Show abstract</span>
        </button>
        <div
          :id="abstractDomId"
          :class="[isMobileAbstractOpen ? 'block' : 'hidden', 'mt-5']"
        >
          <Heading
            level="4"
            style-level="5"
            class="text-blue-900 pt-3 border-t inline-block"
          >
            Abstract
          </Heading>
          <p class="leading-snug text-gray-800">{{ props.abstract }}</p>
        </div>
      </div>
      <div class="hidden lg:block mt-5">
        <!-- desktop abstract -->
        <Heading
          level="4"
          style-level="5"
          class="text-blue-900 pt-3 border-t inline-block"
        >
          Abstract
        </Heading>
        <p class="leading-snug text-gray-800">{{ props.abstract }}</p>
      </div>
      <div class="hidden lg:block"></div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useResponsiveModeStore } from '~/stores/responsiveMode'

type Props = {
  title: string
  href: string
  tag: {
    type: string
    date: Date
  }
  headingLevel: '1' | '2' | '3' | '4' | '5' | '6'
  body?: string[]
  footer?: string[]
  abstract?: string
}

const props = defineProps<Props>()

const isMobileAbstractOpen = ref<boolean>(false)

const responsiveModeStore = useResponsiveModeStore()

const abstractDomId = computed(
  () => `abstract-${(Math.random() * 999999).toString(36)}`
)

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

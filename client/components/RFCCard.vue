<template>
  <Card
    :href="props.href"
    heading-level="3"
    has-cover-link
    :chevron-position="
      props.abstract && responsiveModeStore.responsiveMode === 'Desktop' ?
        'center'
      : 'end'
    "
    class="lg:flex"
    default-slot-class="md:w-1/2 xl:w-2/5 pr-4"
    aside-slot-class="md:w-1/2 xl:w-3/5 border-l pl-12 pr-4"
  >
    <template #headingTitle>
      <component :is="formatTitle(props.title)" />
    </template>
    <template #default>
      <p class="text-base mt-2 text-blue-900 dark:text-white">
        <slot />
      </p>
      <div class="my-4 print:m-0">
        <Tag :text="props.tag" />
      </div>
      <ul
        v-if="props.list1"
        class="hidden lg:block print:block text-base text-blue-900 dark:text-white"
      >
        <li v-for="(part, index) in props.list1" :key="index" class="inline">
          <GraphicsDiamond v-if="index > 0" />{{ part }}
        </li>
      </ul>
      <ul
        v-if="props.list2"
        class="hidden lg:block print:block text-base text-gray-800 mt-1 dark:text-white"
      >
        <li v-for="(part, index) in props.list2" :key="index" class="inline">
          <GraphicsDiamond v-if="index > 0" class="align-middle" />{{ part }}
        </li>
      </ul>
      <template v-if="props.abstract">
        <div class="block lg:hidden">
          <!-- mobile abstract -->
          <button
            type="button"
            :aria-expanded="isMobileAbstractOpen"
            :aria-controls="abstractDomId"
            class="relative z-50 text-blue-800 dark:text-blue-100 underline text-base p-3 -left-3 -top-3 -mb-3 print:hidden"
            @click="isMobileAbstractOpen = !isMobileAbstractOpen"
          >
            <template v-if="isMobileAbstractOpen">Hide abstract</template>
            <template v-else>Show abstract</template>
          </button>
          <div
            :id="abstractDomId"
            :class="[
              'mt-3',
              {
                'block ': isMobileAbstractOpen,
                'hidden print:block': !isMobileAbstractOpen
              }
            ]"
          >
            <Heading
              level="4"
              style-level="5"
              class="text-blue-900 dark:text-gray-300 pt-3 border-t inline-block"
            >
              Abstract
            </Heading>
            <p class="leading-snug text-gray-800 dark:text-gray-300">
              {{ props.abstract }}
            </p>
          </div>
        </div>
      </template>
      <p
        v-if="props.redNote"
        :class="[
          'text-red-700 dark:text-red-300 text-base print:text-black',
          { 'mt-2': isMobileAbstractOpen }
        ]"
      >
        <Renderable :val="props.redNote" />
      </p>
    </template>
    <template #aside>
      <div class="hidden lg:block mt-5">
        <!-- desktop abstract -->
        <Heading
          level="4"
          style-level="5"
          class="text-blue-900 dark:text-gray-300 inline-block"
        >
          Abstract
        </Heading>
        <p class="leading-snug text-gray-800 dark:text-gray-300 pb-2">
          {{ props.abstract }}
        </p>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { formatTitle } from './rfc'
import { useResponsiveModeStore } from '~/stores/responsiveMode'

type Props = {
  title: string
  href: string
  tag: string[]
  headingLevel: '1' | '2' | '3' | '4' | '5' | '6'
  list1?: string[]
  list2?: string[]
  abstract?: string
  redNote?: string | VNode
}

const props = defineProps<Props>()

const isMobileAbstractOpen = ref<boolean>(false)

const responsiveModeStore = useResponsiveModeStore()

const abstractDomId = computed(
  () => `abstract-${(Math.random() * 999999).toString(36)}`
)

// const asideClass = { "class": "basis-1/2" }
</script>

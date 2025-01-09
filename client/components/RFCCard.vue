<template>
  <Card
    :href="rfcPathBuilder(`RFC${props.rfc.number}`)"
    :heading-level="props.headingLevel"
    has-cover-link
    :chevron-position="
      props.rfc.abstract && responsiveModeStore.responsiveMode === 'Desktop' ?
        'center'
      : 'end'
    "
    :class="props.showAbstract && props.rfc.abstract ? 'lg:flex' : undefined"
    :default-slot-class="
      props.showAbstract && props.rfc.abstract ?
        'lg:w-1/2 xl:w-2/5 pr-4'
      : undefined
    "
    :aside-slot-class="
      props.showAbstract && props.rfc.abstract ?
        'lg:w-1/2 xl:w-3/5 border-l pl-12 pr-4'
      : undefined
    "
  >
    <template #headingTitle>
      <component :is="formatTitle(`rfc${props.rfc.number}`)" />
    </template>
    <template #default>
      <p class="text-base mt-2 text-blue-900 dark:text-white">
        {{ props.rfc.title }}
      </p>
      <div class="my-4 print:m-0">
        <Tag :text="tagText" />
      </div>
      <ul
        v-if="list1"
        class="hidden lg:block print:block text-base text-blue-900 dark:text-white"
      >
        <li v-for="(part, index) in list1" :key="index" class="inline">
          <GraphicsDiamond v-if="index > 0" />{{ part }}
        </li>
      </ul>
      <ul
        v-if="list2"
        class="hidden lg:block print:block text-base text-gray-800 mt-1 dark:text-white"
      >
        <li v-for="(part, index) in list2" :key="index" class="inline">
          <GraphicsDiamond v-if="index > 0" class="align-middle" />{{ part }}
        </li>
      </ul>
      <template v-if="props.showAbstract && props.rfc.abstract">
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
              {{ props.rfc.abstract }}
            </p>
          </div>
        </div>
      </template>
      <p
        v-if="obsoletedBy"
        :class="[
          'text-red-700 dark:text-red-300 text-base print:text-black',
          { 'mt-2': isMobileAbstractOpen }
        ]"
      >
        <Renderable :val="obsoletedBy" />
      </p>
    </template>
    <template v-if="props.showAbstract && !!props.rfc.abstract" #aside>
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
          {{ props.rfc.abstract }}
        </p>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import type { Rfc, RfcMetadata } from '../generated/red-client'
import { rfcPathBuilder } from '../utilities/url'
import { formatTitle, formatTitlePlaintext } from './rfc'
import { useResponsiveModeStore } from '~/stores/responsiveMode'

type Props = {
  rfc: Rfc
  showAbstract?: boolean
  showTagDate?: boolean
  headingLevel?: '1' | '2' | '3' | '4' | '5' | '6'
}

const props = withDefaults(defineProps<Props>(), { headingLevel: '1' })

const isMobileAbstractOpen = ref<boolean>(false)

const responsiveModeStore = useResponsiveModeStore()

const abstractDomId = useId()

function formatAuthors(authors: Rfc['authors']): string {
  if (authors.length === 0) {
    return ''
  }
  if (authors.length === 1) {
    return `${authors[0].name}`
  }

  return `${authors[0].name} and ${authors.length - 1} other${
    authors.length > 2 ? 's' : ''
  }`
}

function formatStreamAndArea(rfc: Rfc): string[] {
  return [rfc.stream?.name, rfc.area?.name].filter(Boolean) as string[]
}

function formatDate(isoDate: string): string {
  const datetime = DateTime.fromISO(isoDate)
  return datetime.toLocaleString({ month: 'long', year: 'numeric' })
}

function formatObsoletedBy(
  obsoletedBy: RfcMetadata['obsoleted_by']
): VNode | undefined {
  if (!obsoletedBy || obsoletedBy.length === 0) return undefined

  return h(
    'span',
    obsoletedBy.reduce(
      (acc, obsoletedByItem, index) => {
        if (index > 0) {
          acc.push(', ')
        }
        acc.push(
          h(
            'a',
            {
              href: rfcPathBuilder(`rfc${obsoletedByItem.number}`),
              title: `${formatTitlePlaintext(`RFC${obsoletedByItem.number}`)}: ${obsoletedByItem.title}`,
              class: 'relative z-50 underline p-1 -m-1 hover:bg-gray-100'
            },
            ['RFC', h('b', obsoletedByItem.number)]
          )
        )

        return acc
      },
      ['Obsoleted by '] as (string | VNode)[]
    )
  )
}

const obsoletedBy = computed(() => {
  return formatObsoletedBy(props.rfc.obsoleted_by)
})

const list1 = computed(() => [
  formatAuthors(props.rfc.authors),
  formatDate(props.rfc.published)
])

const list2 = computed(() => formatStreamAndArea(props.rfc))

const tagText = computed(() => {
  const tagText = [props.rfc.status.name]
  const datetime = DateTime.fromISO(props.rfc.published)
  const relativeCalendar = datetime.toRelativeCalendar()
  if (props.showTagDate && relativeCalendar) {
    tagText.push(relativeCalendar)
  }
  return tagText
})
</script>

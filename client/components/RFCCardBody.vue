<template>
  <div class="md:pr-5 flex-1">
    <p class="text-base text-blue-900 dark:text-white mt-2">
      {{ props.rfc.title }}
    </p>
    <Pill
      v-if="tagText.length > 0"
      size="small"
      :text="tagText"
      class="print:m-0 my-2"
    />
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
      <li v-if="isAprilFool" class="inline pr-2">
        <Icon
          name="fa6-solid:masks-theater"
          size="1em"
          class="text-violet-500 -mb-0.5"
        />
      </li>
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
          class="relative z-50 text-blue-800 cursor-pointer dark:text-blue-100 underline text-base p-3 -left-3 -top-3 -mb-3 print:hidden"
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
          <p class="leading-snug text-gray-800 dark:text-gray-300 text-pretty">
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
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { infoRfcPathBuilder } from '../utilities/url'
import type { RfcCommon } from '~/utilities/rfc'
import { formatTitlePlaintext } from '~/utilities/rfc-converters-utils'

type Props = {
  rfc: RfcCommon
  showAbstract?: boolean
  showTagDate?: boolean
}

const props = defineProps<Props>()

const isMobileAbstractOpen = ref<boolean>(false)

const abstractDomId = useId()

function formatAuthors(authors: RfcCommon['authors']): string {
  if (authors.length === 0) {
    return ''
  } else if (authors.length === 1) {
    return `${authors[0].name}`
  } else if (authors.length === 2) {
    return `${authors[0].name} and ${authors[1].name}`
  } else {
    return (
      authors
        .slice(0, authors.length - 1)
        .map((author) => author.name)
        .join(', ') + `, and ${authors.at(-1)?.name}`
    )
  }
}

function formatDate(isoDate: string): string {
  const datetime = DateTime.fromISO(isoDate)
  return datetime.toLocaleString({
    month: 'long',
    year: 'numeric',
    ...(isAprilFool.value && { day: 'numeric' })
  })
}

function formatObsoletedBy(
  obsoletedBy: RfcCommon['obsoleted_by']
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
              href: infoRfcPathBuilder(`rfc${obsoletedByItem.number}`),
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

const list1 = computed(() => [formatAuthors(props.rfc.authors)])

const list2 = computed(
  () =>
    [
      formatDate(props.rfc.published),
      props.rfc.stream?.name,
      props.rfc.area?.name
    ].filter(Boolean) as string[]
)

const tagText = computed(() => {
  const tagText = []
  if (props.rfc.status) {
    tagText.push(props.rfc.status)
  }
  const datetime = DateTime.fromISO(props.rfc.published)
  const relativeCalendar = datetime.toRelativeCalendar()
  if (props.showTagDate && relativeCalendar) {
    tagText.push(relativeCalendar)
  }
  return tagText
})

const isAprilFool = computed(() => {
  const datetime = DateTime.fromISO(props.rfc.published)
  return datetime.month === 4 && datetime.day === 1
})
</script>

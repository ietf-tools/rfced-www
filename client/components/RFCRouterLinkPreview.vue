<template>
  <b class="clear-right">
    <component :is="formatTitle(props.rfcJson.doc_id)" />
    <GraphicsDiamond />
    <GraphicsIETFMotif
      class="absolute text-black w-[110px] h-[100px] right-0 top-0 print:hidden"
      :opacity="0.04"
    />
  </b>
  <p class="text-base text-blue-900 dark:text-white font-bold leading-5">
    {{ props.rfcJson.title }}
  </p>
  <div class="pt-1">
    <Tag size="small" :text="tagText" />
  </div>
  <p class="leading-5 pt-2 text-xs">
    {{ props.rfcJson.abstract }}
  </p>
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

<script setup lang="ts">
import { DateTime } from 'luxon'
import { infoRfcPathBuilder } from '../utilities/url'
import Anchor from './A.vue'
import {
  formatTitle,
  formatTitlePlaintext,
  parseRfcJsonPubDateToISO,
  type RFCJSON
} from '~/utilities/rfc'

type Props = {
  rfcJson: RFCJSON
}

const props = defineProps<Props>()

const isMobileAbstractOpen = ref<boolean>(false)

function formatAuthors(authors: RFCJSON['authors']): string {
  if (authors.length === 0) {
    return ''
  }
  if (authors.length === 1) {
    return `${authors[0]}`
  }

  return authors.join(', ')
}

function formatStreamAndArea(rfc: RFCJSON): string[] {
  return [rfc.source].filter(Boolean) as string[]
}

function formatDate(isoDate: string): string {
  const datetime = DateTime.fromISO(isoDate)
  return datetime.toLocaleString({ month: 'long', year: 'numeric' })
}

function formatObsoletedBy(
  obsoletedBy: RFCJSON['obsoleted_by']
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
            Anchor,
            {
              href: infoRfcPathBuilder(`rfc${obsoletedByItem}`),
              title: `${formatTitlePlaintext(`RFC${obsoletedByItem}`)}: ${obsoletedByItem}`,
              class: 'relative underline p-1 -m-1 hover:bg-gray-100'
            },
            ['RFC', h('b', obsoletedByItem)]
          )
        )

        return acc
      },
      ['Obsoleted by '] as (string | VNode)[]
    )
  )
}

const obsoletedBy = computed(() => {
  return formatObsoletedBy(props.rfcJson.obsoleted_by)
})

const list1 = computed(() => [
  formatAuthors(props.rfcJson.authors),
  formatDate(parseRfcJsonPubDateToISO(props.rfcJson.pub_date))
])

const list2 = computed(() => formatStreamAndArea(props.rfcJson))

const tagText = computed(() => {
  const tagText: (string | VNode)[] = [props.rfcJson.status]
  const pubDateIso = parseRfcJsonPubDateToISO(props.rfcJson.pub_date)
  const datetime = DateTime.fromISO(pubDateIso)
  const relativeCalendar = datetime.toRelativeCalendar()
  const tooltip = `${props.rfcJson.pub_date} (${relativeCalendar})`
  if (relativeCalendar) {
    tagText.push(
      h(
        'span',
        {
          class: 'w-full h-full',
          'aria-label': tooltip,
          title: tooltip
        },
        [relativeCalendar]
      )
    )
  }
  return tagText
})
</script>

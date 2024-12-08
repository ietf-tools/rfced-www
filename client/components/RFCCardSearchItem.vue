<template>
  <RFCCard
    heading-level="3"
    :title="`RFC${props.searchItem.number}`"
    :href="rfcPathBuilder(props.searchItem.number)"
    :tag="[props.searchItem.status.name]"
    :list1="[
      formatAuthors(props.searchItem.authors),
      formatDate(props.searchItem.published)
    ]"
    :list2="formatStreamAndArea(props.searchItem)"
    abstract=""
    :red-note="formatObsoletedBy(props.searchItem.obsoleted_by)"
  >
    {{ props.searchItem.title }}
  </RFCCard>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import type { RfcMetadata } from '../generated/red-client'
import { rfcPathBuilder } from '~/utilities/url'

type Props = {
  searchItem: RfcMetadata
}

const props = defineProps<Props>()

type Authors = RfcMetadata['authors']

function formatAuthors(authors: Authors): string {
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

function formatStreamAndArea(searchResult: RfcMetadata): string[] {
  return [searchResult.stream?.name, searchResult.area?.name].filter(
    Boolean
  ) as string[]
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
              href: rfcPathBuilder(obsoletedByItem.number),
              title: `RFC${obsoletedByItem.number}: ${obsoletedByItem.title}`,
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
</script>

<template>
  <Popover v-if="thisContentMetadata" class="relative print:hidden">
    <PopoverButton
      class="rounded-md text-sm px-2 py-4 -ml-2 focus:bg-gray-300 dark:focus:bg-gray-500 hover:bg-gray-300 dark:hover:bg-gray-500"
    >
      Last updated {{ relativeDate }}
    </PopoverButton>

    <PopoverPanel
      class="absolute z-10 border-2 rounded-md py-1 px-2 bg-white dark:bg-black"
    >
      <p class="font-mono">Last updated {{ fullDate }}</p>
    </PopoverPanel>
  </Popover>

  <p v-if="thisContentMetadata" class="hidden print:block font-mono">
    Last updated {{ relativeDate }}, {{ fullDate }}
  </p>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

import _contentMetadata from '../generated/content-metadata.json'
import type { ContentMetadata } from '~/scripts/generate-content-metadata'

const contentMetadata: ContentMetadata = _contentMetadata
const route = useRoute()
const thisContentMetadata = contentMetadata[route.path]

let fullDate: string | null = null
let relativeDate: string | null = null

if (thisContentMetadata) {
  const datetime = DateTime.fromISO(thisContentMetadata.mtime)
  relativeDate = datetime.toRelativeCalendar()
  fullDate = datetime.toISO() // don't use localised date, because this will be cached for all users so there is no local timezone except server timezone which is irrelevant for users
}
</script>

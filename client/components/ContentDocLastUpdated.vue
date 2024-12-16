<template>
  <Popover v-if="thisContentMetadata" class="relative print:hidden">
    <PopoverButton
      class="focus:bg-gray-300 dark:focus:bg-gray-500 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md px-2 -ml-2"
    >
      Last updated {{ relativeDate }}
    </PopoverButton>

    <PopoverPanel class="absolute z-10 border-2 rounded-md py-1 px-2">
      <p class="font-mono">Last updated {{ localisedDate }}</p>
    </PopoverPanel>
  </Popover>
  <p v-if="thisContentMetadata" class="hidden print:block font-mono">
    Last updated {{ relativeDate }}, {{ localisedDate }}
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

let localisedDate: string | null = null
let relativeDate: string | null = null

if (thisContentMetadata) {
  const datetime = DateTime.fromISO(thisContentMetadata.mtime)
  relativeDate = datetime.toRelativeCalendar()
  localisedDate = datetime.toLocaleString(DateTime.DATETIME_HUGE)
}
</script>

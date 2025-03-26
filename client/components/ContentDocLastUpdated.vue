<template>
  <TooltipProvider v-if="thisContentMetadata">
    <TooltipRoot>
      <TooltipTrigger> Last updated {{ relativeDate }} </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>
          <p class="font-mono">Last updated {{ fullDate }}</p>
          <TooltipArrow />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
  <p v-if="thisContentMetadata" class="hidden print:block font-mono">
    Last updated {{ relativeDate }}, {{ fullDate }}
  </p>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger
} from 'reka-ui'

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

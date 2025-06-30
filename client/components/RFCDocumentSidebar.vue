<template>
  <div class="h-full print:block">
    <DialogRoot v-model:open="isModalOpen" @close="isModalOpen = false">
      <DialogTrigger />
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          :class="// needs overflow-y-scroll to force scrollbars, to ensure same page width as the main view
          'absolute inset-0 z-50 bg-blue-900 text-white dark:bg-blue-950 dark:text-white overflow-y-scroll h-full'"
        >
          <DialogTitle />
          <DialogDescription>
            <RFCMobileBanner :rfc="props.rfcDoc" :is-fixed="false">
              <button
                class="bg-white rounded-l text-black p-2 flex items-center"
                aria-label="Close"
                @click="isModalOpen = false"
              >
                <GraphicsExpandSidebar class="inline-block mr-1 rotate-180" />
              </button>
            </RFCMobileBanner>
            <div class="px-2">
              <RFCTabs
                ref="mobileRFCTabs"
                v-model:selected-tab="selectedTab"
                :rfcDoc="props.rfcDoc"
              />
            </div>
          </DialogDescription>
          <DialogClose />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
    <div class="sticky top-0 h-[100vh] overflow-y-scroll">
      <RFCTabs
        ref="desktopRFCTabs"
        v-model:selected-tab="selectedTab"
        :rfcDoc="props.rfcDoc"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from 'reka-ui'
import type { Rfc } from '../generated/red-client'

type Props = {
  rfcDoc: Rfc
  rfcHtml: string
  gotoErrata: () => void
}

const isModalOpen = defineModel<boolean>('isModalOpen')

const selectedTab = defineModel<number>('selectedTab')

const props = defineProps<Props>()
</script>

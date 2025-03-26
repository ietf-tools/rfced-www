<template>
  <div class="w-full">
    <DialogRoot :open="isModalOpen" @close="isModalOpen = false">
      <DialogTrigger />
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle />
          <DialogDescription>
            <RFCMobileBanner :rfc="props.rfc" :is-fixed="false">
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
                :rfc="props.rfc"
              />
            </div>
          </DialogDescription>
          <DialogClose />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
    <div class="hidden lg:block print:block">
      <RFCTabs
        ref="desktopRFCTabs"
        v-model:selected-tab="selectedTab"
        :rfc="props.rfc"
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
  rfc: Rfc
  gotoErrata: () => void
}

const isModalOpen = defineModel<boolean>('isModalOpen')

const selectedTab = defineModel<number>('selectedTab')

const props = defineProps<Props>()
</script>

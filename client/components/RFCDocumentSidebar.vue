<template>
  <div class="w-full">
    <button
      type="button"
      class="fixed right-0 rounded-l bg-white dark:bg-black border border-gray-200 align-middle flex items-center pr-2 lg:hidden p-1"
      aria-label="Open details modal"
      @click="isOpen = true"
    >
      <GraphicsExpandSidebar class="inline-block mr-1" />
      Info
    </button>
    <HeadlessDialog
      :open="isOpen"
      class="absolute inset-0 rounded bg-white dark:bg-black w-full h-full"
      @close="isOpen = false"
    >
      <HeadlessDialogPanel>
        <RFCMobileBanner :rfc-id="rfcId" :is-fixed="false">
          <button
            class="bg-white rounded-l text-black p-2 flex items-center"
            aria-label="Close"
            @click="isOpen = false"
          >
            <GraphicsExpandSidebar class="inline-block mr-1 rotate-180" />
          </button>
        </RFCMobileBanner>
        <div class="px-2">
          <RFCTabs
            ref="mobileRFCTabs"
            :errata="props.errata"
            :selected-tab="selectedTab"
            :change-tab="changeTab"
          />
        </div>
      </HeadlessDialogPanel>
    </HeadlessDialog>
    <div class="hidden lg:block">
      <RFCTabs
        ref="desktopRFCTabs"
        :errata="props.errata"
        :selected-tab="selectedTab"
        :change-tab="changeTab"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { parseRFCId } from './rfc'

type Props = {
  id: string
  errata: string[]
  gotoErrata: () => void
}

const props = defineProps<Props>()
const rfcId = computed(() => parseRFCId(props.id))
</script>

<template>
  <div class="w-full">
    <HeadlessDialog
      :open="isModalOpen"
      class="absolute inset-0 rounded bg-white dark:bg-black w-full h-full"
      @close="isModalOpen = false"
    >
      <HeadlessDialogPanel>
        <RFCMobileBanner :rfc-id="rfcId" :is-fixed="false">
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
            :errata="props.errata"
          />
        </div>
      </HeadlessDialogPanel>
    </HeadlessDialog>
    <div class="hidden lg:block">
      <RFCTabs
        ref="desktopRFCTabs"
        v-model:selected-tab="selectedTab"
        :errata="props.errata"
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

const isModalOpen = defineModel<boolean>('isModalOpen')

const selectedTab = defineModel<number>('selectedTab')

const props = defineProps<Props>()
const rfcId = computed(() => parseRFCId(props.id))
</script>

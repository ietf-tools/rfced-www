<template>
  <BodyLayoutDocument>
    <template #sidebar>
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
    <Breadcrumbs :breadcrumb-items="breadcrumbItems" />
    <Heading level="1" class="mb-2">
      {{ rfcId.type }} {{ rfcId.number }}
    </Heading>

    <RFCMobileBanner :rfc-id="rfcId" :is-fixed="true" />

    <p v-if="props.intro">{{ props.intro }}</p>
    <div class="flex flex-row justify-between items-center flex-wrap">
      <div class="align-middle">
        <Tag
          :text="
            rfcId.type === RFC
              ? ['Internet Standard', props.meta ?? rfcId.number]
              : [rfcId.type, rfcId.number]
          "
        />
        <HeadlessPopover class="inline align-middle">
          <HeadlessPopoverButton
            aria-label="Details of category"
            class="inline-block text-blue-300 p-2 ml-1"
          >
            <GraphicsQuestionMarkCircle />
          </HeadlessPopoverButton>

          <HeadlessPopoverPanel
            class="absolute z-10 shadow-md lg:w-auto bg-white border rounded dark:bg-black dark:border-white p-2"
          >
            <p class="leading-6">
              For the definition of <b>Status</b>, see
              <a href="/info/rfc2026">RFC 2026</a>.
            </p>
            <p class="leading-6">
              For the definition of <b>Stream</b>, see
              <a href="/info/rfc8729">RFC 8729</a>.
            </p>
          </HeadlessPopoverPanel>
        </HeadlessPopover>
      </div>
      <div v-if="props.errata">
        <button
          type="button"
          class="text-sm underline text-blue-300"
          @click="gotoErrata"
        >
          {{ props.errata.length }}

          <template v-if="props.errata.length === 1">erratum</template>
          <template v-else>errata</template>
        </button>
      </div>
    </div>

    <div
      v-for="(page, index) in props.pagesHtml"
      :key="index"
      class="mt-10 text-xs md:text-xs lg:text-sm"
    >
      <div v-html="page" class="whitespace-pre-wrap" />
    </div>
  </BodyLayoutDocument>
</template>

<script setup lang="ts">
import { parseRFCId, RFC } from './rfc'
import type { BreadcrumbItem } from '~/components/BreadcrumbsTypes'

type Props = {
  id: string
  meta?: ReturnType<typeof h>
  intro: string
  pagesHtml: string[]
  errata: string[]
}

const props = defineProps<Props>()

const selectedTab = ref(0)

function changeTab(index: number) {
  selectedTab.value = index
}

function gotoErrata() {
  const responsiveModeStore = useResponsiveModeStore()

  if (responsiveModeStore.responsiveMode === 'Mobile') {
    isOpen.value = true
  }

  selectedTab.value = 2

  nextTick(() => {
    // there are potentially two in the DOM but only one should be visible
    const errataTabs =
      document.querySelectorAll<HTMLElement>('[data-errata-tab]')

    function focusIfVisible(elm: HTMLElement) {
      if (elm.checkVisibility()) {
        elm.focus()
      }
    }

    if (errataTabs) {
      errataTabs.forEach(focusIfVisible)
    }
  })
}

const rfcId = computed(() => parseRFCId(props.id))

const breadcrumbItems: BreadcrumbItem[] = [
  { url: '/', label: 'Home' },
  { url: '/info', label: 'Documents' }
]

const isOpen = ref(false)
</script>

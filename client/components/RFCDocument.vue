<template>
  <BodyLayoutDocument>
    <template #sidebar>
      <RFCDocumentSidebar
        v-model:selected-tab="selectedTab"
        v-model:is-modal-open="isModalOpen"
        :rfc="props.rfc"
        :goto-errata="gotoErrata"
        :change-tab="changeTab"
      />
    </template>
    <RFCDocumentBody
      v-model:is-modal-open="isModalOpen"
      :rfc="props.rfc"
      :breadcrumb-items="breadcrumbItems"
      :goto-errata="gotoErrata"
      :change-tab="changeTab"
    />
  </BodyLayoutDocument>
</template>

<script setup lang="ts">
import type { Rfc } from '../generated/red-client'
import type { BreadcrumbItem } from '~/components/BreadcrumbsTypes'

type Props = {
  rfc: Rfc
}

const props = defineProps<Props>()

const selectedTab = ref(0)

function changeTab(index: number) {
  selectedTab.value = index
}

function gotoErrata() {
  const responsiveModeStore = useResponsiveModeStore()

  if (responsiveModeStore.responsiveMode === 'Mobile') {
    isModalOpen.value = true
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

const breadcrumbItems: BreadcrumbItem[] = [
  { url: '/', label: 'Home' },
  { url: '/info', label: 'Documents' }
]

const isModalOpen = ref(false)
</script>

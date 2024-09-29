<template>
  <BodyLayoutDocument>
    <template #sidebar>
      <RFCDocumentSidebar
        :id="props.id"
        :goto-errata="gotoErrata"
        :errata="props.errata"
        :change-tab="changeTab"
      />
    </template>
    <RFCDocumentBody
      :id="props.id"
      :intro="props.intro"
      :pages-html="props.pagesHtml"
      :breadcrumb-items="breadcrumbItems"
      :goto-errata="gotoErrata"
      :errata="props.errata"
      :change-tab="changeTab"
    />
  </BodyLayoutDocument>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '~/components/BreadcrumbsTypes'

type Props = {
  id: string
  meta?: ReturnType<typeof h>
  intro: string
  obsoletedBy?: string
  seeAlso?: string
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

const breadcrumbItems: BreadcrumbItem[] = [
  { url: '/', label: 'Home' },
  { url: '/info', label: 'Documents' }
]

const isOpen = ref(false)
</script>

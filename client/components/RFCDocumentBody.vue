<template>
  <GraphicsIETFMotif
    class="absolute mt-8 -mb-[600px] left-0 w-[80vw] h-[80vh] max-h-[600px]"
    :opacity="0.02"
  />

  <Breadcrumbs :breadcrumb-items="breadcrumbItems" />

  <button
    type="button"
    class="fixed right-0 rounded-l bg-white dark:bg-black border border-gray-200 align-middle flex items-center p-1 pr-2 lg:hidden"
    aria-label="Open details modal"
    @click="isModalOpen = true"
  >
    <GraphicsExpandSidebar class="inline-block mr-1" />
    Info
  </button>

  <Heading level="1" class="mb-2 px-1 xs:px-0">
    {{ rfcId.type }} {{ rfcId.number }}
  </Heading>

  <RFCMobileBanner :rfc-id="rfcId" :is-fixed="true" />

  <p v-if="props.intro" class="px-1 xs:px-0 mb-2 text-base lg:text-xl">
    {{ props.intro }}
  </p>

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
          class="inline-block text-blue-300 dark:text-blue-100 p-2 ml-1"
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
        class="text-sm underline text-blue-300 dark:text-blue-100 p-2"
        @click="gotoErrata"
      >
        {{ props.errata.length }}

        <template v-if="props.errata.length === 1">erratum</template>
        <template v-else>errata</template>
      </button>
    </div>
  </div>

  <Alert
    v-if="props.obsoletedBy && obsoletedByRFCId"
    variant="warning"
    heading="This RFC is now obsolete"
  >
    <p class="text-sm">
      For more information, please refer to
      <a :href="`/info/${props.obsoletedBy}`"
        >{{ obsoletedByRFCId.type }} {{ obsoletedByRFCId.number }}
        {{ obsoletedByRFCId.title }}
      </a>
    </p>
  </Alert>

  <Alert
    v-if="props.seeAlso"
    variant="info"
    heading="This RFC updates the following RFC:"
  >
    <p class="text-sm">
      See also
      <a href="/info/rfc9052"
        >RFC 9052 CBOR Object Signing and Encryption (COSE): Structures and
        Process</a
      >
    </p>
  </Alert>

  <div
    v-for="(page, index) in props.pagesHtml"
    :key="index"
    class="mt-10 text-[9px] sm:text-xs lg:text-sm"
  >
    <div v-html="page" class="font-mono whitespace-pre-wrap px-3 xs:px-0" />
  </div>
</template>

<script setup lang="ts">
import { parseRFCId, RFC } from './rfc'
import type { BreadcrumbItem } from '~/components/BreadcrumbsTypes'

type Props = {
  id: string
  intro: string
  errata: string[]
  gotoErrata: () => void
  meta?: ReturnType<typeof h>
  obsoletedBy?: string
  seeAlso?: string
  pagesHtml: string[]
  breadcrumbItems: BreadcrumbItem[]
}

const props = defineProps<Props>()

const isModalOpen = defineModel<boolean>('isModalOpen')

const rfcId = computed(() => parseRFCId(props.id))

const obsoletedByRFCId = computed(() =>
  props.obsoletedBy ? parseRFCId(props.obsoletedBy) : undefined
)
</script>

<template>
  <div class="min-h-[100vh]">
    <NuxtLayout name="white">
      <template v-if="rfcDocRetrieveError || rfcHtmlError">
        <Alert level="1" variant="warning" heading="Error">
          {{ rfcDocRetrieveError }} {{ rfcHtmlError }}
        </Alert>
      </template>
      <template
        v-else-if="
          rfc &&
          rfcDocRetrieveStatus === 'success' &&
          rfcBucketHtmlDocument &&
          rfcHtmlStatus === 'success'
        "
      >
        <RFCDocument :rfc="rfc" :rfc-bucket-html-doc="rfcBucketHtmlDocument" />
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { Rfc } from '~/generated/red-client'
import { parseRFCId } from '~/utilities/rfc'
import {
  rfcBucketHtmlToRfcDocument,
  rfcToRfcCommon
} from '~/utilities/rfc-converters'
import {
  apiRfcDocRetrievePathBuilder,
  apiRfcBucketHtmlURLBuilder
} from '~/utilities/url'

const route = useRoute()

const {
  data: rfcDocRetrieve,
  status: rfcDocRetrieveStatus,
  error: rfcDocRetrieveError
} = await useAsyncData<Rfc>(`info-docretrieve-${route.params.id}`, async () => {
  const id = parseRFCId(route.params.id.toString())
  const rfcNumber = parseInt(id.number, 10)
  return $fetch(apiRfcDocRetrievePathBuilder(rfcNumber))
})

const rfc = computed(() => {
  if (!rfcDocRetrieve.value) return
  return rfcToRfcCommon(rfcDocRetrieve.value)
})

const {
  data: rfcHtml,
  status: rfcHtmlStatus,
  error: rfcHtmlError
} = await useAsyncData<string>(`info-dochtml-${route.params.id}`, async () => {
  const id = parseRFCId(route.params.id.toString())
  const rfcNumber = parseInt(id.number, 10)
  return $fetch(apiRfcBucketHtmlURLBuilder(rfcNumber))
})

const rfcBucketHtmlDocument = computed(() => {
  if (!rfcHtml.value) return undefined
  return rfcBucketHtmlToRfcDocument(rfcHtml.value)
})

definePageMeta({
  layout: false
})
</script>

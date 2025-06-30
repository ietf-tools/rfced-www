<template>
  <div class="min-h-[100vh]">
    <NuxtLayout name="white">
      <template v-if="rfcDocError || rfcHtmlError">
        <Alert level="1" variant="warning" heading="Error">
          {{ rfcDocError }} {{ rfcHtmlError }}
        </Alert>
      </template>
      <template
        v-else-if="
          rfcDoc &&
          rfcDocStatus === 'success' &&
          rfcHtml &&
          rfcHtmlStatus === 'success'
        "
      >
        <RFCDocument :rfc-doc="rfcDoc" :rfc-html="rfcHtml" />
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { Rfc } from '~/generated/red-client'
import { parseRFCId } from '~/utilities/rfc'
import {
  apiRfcDocRetrievePathBuilder,
  apiRfcHtmlFragmentPathBuilder
} from '~/utilities/url'

const route = useRoute()

const {
  data: rfcDoc,
  status: rfcDocStatus,
  error: rfcDocError
} = await useAsyncData<Rfc>(`info-docretrieve-${route.params.id}`, async () => {
  const id = parseRFCId(route.params.id.toString())
  const rfcNumber = parseInt(id.number, 10)
  return $fetch(apiRfcDocRetrievePathBuilder(rfcNumber))
})

const {
  data: rfcHtml,
  status: rfcHtmlStatus,
  error: rfcHtmlError
} = await useAsyncData<string>(`info-dochtml-${route.params.id}`, async () => {
  const id = parseRFCId(route.params.id.toString())
  const rfcNumber = parseInt(id.number, 10)
  return $fetch(apiRfcHtmlFragmentPathBuilder(rfcNumber))
})

definePageMeta({
  layout: false
})
</script>

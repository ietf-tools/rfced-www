<template>
  <div class="min-h-[100vh]">
    <NuxtLayout name="white">
      <template v-if="rfcError">
        <Alert level="1" variant="warning" heading="Error">
          {{ rfcError }}
        </Alert>
      </template>
      <template v-else-if="rfc && status === 'success'">
        <RFCDocument :rfc="rfc" />
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { getRedClient } from '~/utilities/redClientWrappers'
import { parseRFCId } from '~/utilities/rfc'

const route = useRoute()

const {
  data: rfc,
  status,
  error: rfcError
} = await useAsyncData(`info-${route.params.id}`, async () => {
  const id = parseRFCId(route.params.id.toString())
  const redApi = getRedClient()
  const rfcNumber = parseInt(id.number, 10)
  return redApi.red.docRetrieve(rfcNumber)
})

definePageMeta({
  layout: false
})
</script>

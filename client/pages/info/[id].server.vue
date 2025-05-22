<template>
  <div class="min-h-[100vh]">
    <NuxtLayout name="white">
      <template v-if="rfcError">
        <Alert level="1" variant="warning" heading="Error">
          {{ rfcError }}

          {{ JSON.stringify(rfcError) }}
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
  const rfcId = parseRFCId(route.params.id.toString())
  console.log('parsed rfcId', JSON.stringify(rfcId))
  const redApi = getRedClient()
  console.log('got red client')
  const rfcNumber = parseInt(rfcId.number, 10)
  console.log('rfc id')
  try {
    return redApi.red.docRetrieve(rfcNumber)
  } catch (e) {
    console.error('rfc', e?.toString())
  }
})

if (rfcError) {
  console.error(JSON.stringify(rfcError.value))
}

definePageMeta({
  layout: false
})
</script>

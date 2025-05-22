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
import type { Rfc } from '~/generated/red-client'
import { parseRFCId } from '~/utilities/rfc'

const route = useRoute()

async function readableStreamToString(
  stream: ReadableStream<Uint8Array<ArrayBufferLike>> | null
) {
  if (!stream) return 'NO STREAM'

  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let result = ''

  while (true) {
    const { value, done } = await reader.read()

    if (value) {
      // Decode the current chunk and append to result
      result += decoder.decode(value, { stream: !done })
    }

    if (done) {
      break
    }
  }

  return result
}

const {
  data: rfc,
  status,
  error: rfcError
} = await useAsyncData(`info-${route.params.id}`, async () => {
  const config = useRuntimeConfig()
  const {
    cfServiceTokenId,
    cfServiceTokenSecret,
    public: { datatrackerBase }
  } = config

  const headers: Record<string, string> = {}
  if (cfServiceTokenId && typeof cfServiceTokenId === 'string') {
    headers['CF-Access-Client-Id'] = cfServiceTokenId
  }
  if (cfServiceTokenSecret && typeof cfServiceTokenSecret === 'string') {
    headers['CF-Access-Client-Secret'] = cfServiceTokenSecret
  }

  const rfcId = parseRFCId(route.params.id.toString())
  console.log('parsed rfcId', JSON.stringify(rfcId))

  const rfcNumber = parseInt(rfcId.number, 10)
  console.log('rfc id', rfcNumber)
  const getUrl = new URL(
    `/api/red/doc/${rfcNumber}/`,
    datatrackerBase
  ).toString()
  console.log(
    'About to fetch',
    getUrl,
    ' with headers ',
    JSON.stringify(Object.keys(headers))
  )
  try {
    const response = await fetch(getUrl, { method: 'get', headers })
    if (!response.ok) {
      console.error('fetch response not ok', response.url)
      console.error('response status', response.status)
      console.error('response statusText', response.statusText)
      const body = await readableStreamToString(response.body)
      console.error('response body', body)
      throw Error(`Unable to fetch ${getUrl}`)
    }
    return (await response.json()) as Rfc
  } catch (e) {
    console.error('error from api client')
    console.error(
      JSON.stringify(e && typeof e === 'object' ? Object.keys(e) : 'not object')
    )
    console.error(JSON.stringify(e))
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

<template>
  <div>
    <SectionHeader>
      <Heading level="1" class="w-full mt-0 mb-4 pl-5 md:p-0 text-balance">
        RFC Index
      </Heading>
      <p class="leading-6 mb-2 pl-5 md:p-0 md:w-1/2">
        CREATED ON: Jan - 28 - 2025
      </p>
    </SectionHeader>
    <div class="container mx-auto mt-10">
      <p class="leading-6 mb-10 pl-5 md:p-0 md:w-1/2">
        This file contains citations for all RFCs in numeric order. RFC
        citations appear in this format:
      </p>

      <RFCIndexTable
        :rfcSummaries="exampleRfcSummaries"
        isExample
      ></RFCIndexTable>
      <p>For example:</p>
      <RFCIndexTable :rfcSummaries="exampleRfcSummaries"></RFCIndexTable>

      <h2>Key to Citations</h2>
      <ul>
        <li>#### is the RFC number.</li>
        <li>
          Following the number are the title, the author list, and the
          publication date.
        </li>
        <li>
          The format follows in parentheses. One or more of the following
          formats are listed: text (TXT), PostScript (PS), Portable Document
          Format (PDF), HTML, XML.
        </li>
        <li>"Obsoletes xxxx" refers to other RFCs that this one replaces.</li>
        <li>"Obsoleted-By xxxx" refers to RFCs that have replaced this one.</li>
        <li>
          "Updates xxxx" refers to other RFCs that this one merely updates but
          does not replace.
        </li>
        <li>
          "Updated-By xxxx" refers to RFCs that have updated but not replaced
          this one.
        </li>
        <li>
          "(Also zzz##)" gives pointer(s) to equivalent sub-series documents, if
          any. Here zzz is one of the sub-series designators STD, BCP, or FYI.
          In a few cases, the Also field points to an equivalent number in some
          other document series.
        </li>
        <li>
          The Status field gives the document's current status (see
          <a :href="rfcPathBuilder('RFC2026')">RFC 2026</a> and
          <a :href="rfcPathBuilder('RFC6410')">RFC 6410</a>).
        </li>
        <li>
          The Stream field gives the document's stream (see
          <a :href="rfcPathBuilder('RFC4844')">RFC 4844</a>), followed by Area
          and WG when relevant.
        </li>
        <li>The DOI field gives the Digital Object Identifier.</li>
      </ul>
      <p>
        See the
        <a :href="PUBLIC_SITE">RFC Editor Web page</a> for more information.
      </p>

      <Alert
        variant="warning"
        level="1"
        v-if="error"
        heading="Error loading RFCs"
      >
        {{ error }}
      </Alert>

      <RFCIndexTable v-if="rfcs" :rfcSummaries="rfcSummaries"></RFCIndexTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { ApiClient } from '~/generated/red-client'
import { setTimeoutPromise } from '~/utilities/promises'
import { formatAuthor } from '~/utilities/rfc'
import { getRFCWithExtraFields } from '~/utilities/rfc.mocks'
import { PRIVATE_API_URL, PUBLIC_SITE, rfcPathBuilder } from '~/utilities/url'
const CACHE_KEY = 'rfc-index.html'

type DocListArg = Parameters<ApiClient['red']['docList']>[0]

type DocListRfc = ReturnType<typeof getRFCWithExtraFields>

const { data: rfcs, error } = await useAsyncData(CACHE_KEY, async () => {
  const abortController = new AbortController()
  const delayBetweenRequestsMs = 50
  const rfcs: ReturnType<typeof getRFCWithExtraFields>[] = []

  const redApi = new ApiClient({ baseUrl: PRIVATE_API_URL })

  const docListArg: DocListArg = {}
  docListArg.sort = ['-number'] // sort by oldest RFC to find the end
  docListArg.limit = 1 // we only need one result
  const response = await redApi.red.docList(docListArg)
  const largestRfcNumber = response.results[0].number

  docListArg.sort = ['number'] // sort by first RFC
  let offset = 0

  while (!abortController.signal.aborted) {
    docListArg.offset = offset
    docListArg.limit = 1000

    const response = await redApi.red.docList(docListArg)
    offset += response.results.length

    rfcs.push(
      ...response.results.map((rfcMetadata) =>
        getRFCWithExtraFields(rfcMetadata)
      )
    )

    if (
      response.results.some(
        (rfcMetadata) => rfcMetadata.number === largestRfcNumber
      )
    ) {
      break
    }

    if (delayBetweenRequestsMs > 0) {
      await setTimeoutPromise(delayBetweenRequestsMs)
    }
  }

  return rfcs
})

const rfcSummaries = computed(() => {
  if (!rfcs.value) return []

  return rfcs.value.map((rfc) => {
    const [month, year] = DateTime.fromISO(rfc.published)
      .toFormat('LLLL yyyy')
      .split(' ')

    const body = h(
      'span',
      `${rfc.authors.map(formatAuthor)} [ ${month} ${year} ] ${rfc.formats ? `(${rfc.formats.map((format) => format.type).join(', ')})` : ''} (Status: ${rfc.status.name}) (Stream: ${rfc.stream.name}) ${rfc.identifiers ? `(${rfc.identifiers.map((identifier) => `${identifier.type}: ${identifier.value}`)})` : ''}`
    )

    return {
      number: rfc.number,
      heading: rfc.title,
      body
    }
  })
})

const rfcSummary5234 = rfcSummaries.value?.find((rfc) => rfc.number === 5234)
const exampleRfcSummaries = rfcSummary5234 ? [rfcSummary5234] : []
</script>

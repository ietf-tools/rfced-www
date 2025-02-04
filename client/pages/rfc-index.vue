<template>
  <div>
    <SectionHeader>
      <Heading level="1" class="w-full mt-0 mb-4 pl-5 md:p-0 text-balance">
        RFC Index
      </Heading>
      <p class="leading-6 mb-2 pl-5 md:p-0 md:w-1/2">
        CREATED ON: {{ createdOn }}
      </p>
    </SectionHeader>
    <div class="container mx-auto mt-10">
      <p class="leading-6 mb-2 pl-5 md:p-0 md:w-1/2">
        This file contains citations for all RFCs in numeric order. RFC
        citations appear in this format:
      </p>
      <RFCIndexTable :rfc-rows="exampleRfcSummaries" is-example></RFCIndexTable>

      <p>For example:</p>
      <RFCIndexTable :rfc-rows="exampleRfcSummaries"></RFCIndexTable>

      <Heading level="2" class="mt-4 mb-2">Key to Citations</Heading>
      <ul class="list-disc ml-6">
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
        See the <a :href="PUBLIC_SITE">RFC Editor Web page</a> for more
        information.
      </p>

      <Alert
        v-if="error"
        variant="warning"
        level="1"
        heading="Error loading RFCs"
      >
        {{ error }}
      </Alert>

      <Heading v-if="rfcs" level="1" class="mt-6 mb-3">RFC Index</Heading>
      <RFCIndexTable v-if="rfcs" :rfc-rows="rfcRows"></RFCIndexTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { ApiClient } from '~/generated/red-client'
import { getAllRFCs } from '~/utilities/redClientWrappers'
import { rfcToRfcIndexRow } from '~/utilities/rfc-index-html'
import { PRIVATE_API_URL, PUBLIC_SITE, rfcPathBuilder } from '~/utilities/url'

const DE_DUP_KEY = 'rfc-index.html'
const createdOn = DateTime.now().toFormat('d LLLL yyyy')
const apiClient = new ApiClient({ baseUrl: PRIVATE_API_URL })
const { data: rfcs, error } = await useAsyncData(DE_DUP_KEY, () =>
  getAllRFCs(apiClient)
)
const rfcRows = computed(() => {
  if (!rfcs.value) return []
  return rfcs.value.map(rfcToRfcIndexRow)
})
const rfcSummary5234 = rfcRows.value?.find((rfc) => rfc.number === 5234)
const exampleRfcSummaries = rfcSummary5234 ? [rfcSummary5234] : []
</script>

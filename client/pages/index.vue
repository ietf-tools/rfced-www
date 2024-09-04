<template>
  <div class="min-h-[100vh]">
    <NuxtLayout name="default">
      <template #subheader>
        <IndexSubheader />
      </template>
      <Heading level="2" has-icon>Latest RFCs</Heading>

      <div class="grid grid-cols-3 gap-4">
        <RFCCard
          title="RFC9392"
          heading-level="3"
          author="C. Perkins"
          :tag="{
            type: 'Informational',
            date: new Date(Date.now() - 3 * (24 * 60 * 60 * 1000))
          }"
          intro="Message Header Field for Indicating Message Authentication Status"
          :body="['C. Perkins', 'Date']"
          :footer="['IETF Stream']"
        >
          Sending RTP Control Protocol (RTPCP) Feedback for Congestion Control
          in Interactive Multimedia Conferences
        </RFCCard>

        <RFCCard
          title="RFC9230"
          heading-level="3"
          :tag="{
            type: 'Experimental',
            date: new Date(Date.now() - 3 * (24 * 60 * 60 * 1000))
          }"
          intro="Message Header Field for Indicating Message Authentication Status"
          :body="['E. Kinnear and 3 others', 'June 2022']"
          :footer="['Independent Stream', 'Area', 'Working group']"
        >
          Oblivious DNS over HTTPS
        </RFCCard>

        <RFCCard
          title="RFC9392"
          heading-level="3"
          :tag="{
            type: 'Proposed Standard',
            date: new Date()
          }"
          intro="Message Header Field for Indicating Message Authentication Status"
          :body="['M. Kucherawy', 'May 2019']"
          :footer="['IETF Stream', 'Reporting & Conformance Working Group']"
        >
          Message Header Field for Indicating Message Authentication Status
        </RFCCard>
      </div>

      <Heading level="2" has-icon>Learn about RFCs</Heading>

      <div class="flex gap-4">
        <Card href="/sdf" heading-level="3" has-cover-link>
          <template #headingTitle>What is an RFC?</template>
          <p class="text-base mt-2 text-blue-900 dark:text-white">
            Short description of the page here if it seems useful to show
          </p>
        </Card>

        <Card href="/sdf" heading-level="3" has-cover-link>
          <template #headingTitle>What is an RFC?</template>
          <p class="text-base mt-2 text-blue-900 dark:text-white">
            Short description of the page here if it seems useful to show
          </p>
        </Card>

        <Card href="/sdf" heading-level="3" has-cover-link>
          <template #headingTitle>What is an RFC?</template>
          <p class="text-base mt-2 text-blue-900 dark:text-white">
            Short description of the page here if it seems useful to show
          </p>
        </Card>

        <Card href="/sdf" heading-level="3" has-cover-link>
          <template #headingTitle>What is an RFC?</template>
          <p class="text-base mt-2 text-blue-900 dark:text-white">
            Short description of the page here if it seems useful to show
          </p>
        </Card>
      </div>

      <Heading level="2" has-icon>Browse RFCs</Heading>

      <Heading level="2" has-icon>Start Participating</Heading>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>

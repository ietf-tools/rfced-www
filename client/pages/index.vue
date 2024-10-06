<template>
  <div class="min-h-[100vh]">
    <NuxtLayout name="default">
      <template #subheader>
        <IndexSubheader />
      </template>
      <div class="container mx-auto">
        <div
          class="flex flex-col-reverse lg:flex-row lg:items-center justify-between"
        >
          <Heading level="2" has-icon class="text-left mt-10 pl-5 md:pl-0">
            Latest RFCs
          </Heading>
          <p class="hidden mt-8 lg:block text-sm text-grey-800 pl-5">
            Looking for works in progress? Go to
            <a href="https://datatracker.ietf.org/" class="text-blue-300 dark:text-blue-100"
              >datatracker.ietf.org</a
            >
          </p>
        </div>
        <div class="grid grid-cols-1 mt-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RFCCard
            href="/"
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
            href="/"
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
            href="/"
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

        <Heading level="2" has-icon class="pl-5 mt-10 mb-5 md:p-0">Learn about RFCs</Heading>
        <div class="grid grid-cols-1 mt-3 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card href="/sdf" heading-level="3" has-cover-link>
            <template #headingTitle>What is an RFC?</template>
            <p class="text-base mt-2 text-blue-900 dark:text-white">
              Short description of the page here if it seems useful to show
            </p>
          </Card>

          <Card href="/sdf" heading-level="3" has-cover-link>
            <template #headingTitle>What are Errata?</template>
            <p class="text-base mt-2 text-blue-900 dark:text-white">
              Short description of the page here if it seems useful to show
            </p>
          </Card>

          <Card href="/sdf" heading-level="3" has-cover-link>
            <template #headingTitle>FAQs</template>
            <p class="text-base mt-2 text-blue-900 dark:text-white">
              Short description of the page here if it seems useful to show
            </p>
          </Card>

          <Card href="/sdf" heading-level="3" has-cover-link>
            <template #headingTitle>About the RFC Editor</template>
            <p class="text-base mt-2 text-blue-900 dark:text-white">
              Short description of the page here if it seems useful to show
            </p>
          </Card>
        </div>

        <Heading level="2" has-icon class="pl-5 mt-10 mb-5 md:p-0"> Browse RFCs </Heading>
        <div class="grid grid-cols-1 mt-3 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card href="/sdf" heading-level="3" has-cover-link>
            <template #headingTitle>By Stream</template>
            <p class="text-base mt-2 text-blue-900 dark:text-white">
              Short description of the page here if it seems useful to show
            </p>
          </Card>

          <Card href="/sdf" heading-level="3" has-cover-link>
            <template #headingTitle>By Status</template>
            <p class="text-base mt-2 text-blue-900 dark:text-white">
              Short description of the page here if it seems useful to show
            </p>
          </Card>

          <Card href="/sdf" heading-level="3" has-cover-link>
            <template #headingTitle>By Service</template>
            <p class="text-base mt-2 text-blue-900 dark:text-white">
              Short description of the page here if it seems useful to show
            </p>
          </Card>

          <Card href="/sdf" heading-level="3" has-cover-link>
            <template #headingTitle>Download RFCs</template>
            <p class="text-base mt-2 text-blue-900 dark:text-white">
              Short description of the page here if it seems useful to show
            </p>
          </Card>
        </div>

        <Heading level="2" has-icon class="pl-5 mt-10 mb-5 md:p-0">
          Start Participating
        </Heading>
        <div class="grid grid-cols-1 mt-3 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card href="/sdf" heading-level="3" has-cover-link>
            <template #headingTitle>Internet Engineering Task Force</template>
            <p class="text-base mt-2 text-blue-900 dark:text-white">
              Short description of the page here if it seems useful to show
            </p>
          </Card>

          <Card href="/sdf" heading-level="3" has-cover-link>
            <template #headingTitle>Internet Research Task Force</template>
            <p class="text-base mt-2 text-blue-900 dark:text-white">
              Short description of the page here if it seems useful to show
            </p>
          </Card>

          <Card href="/sdf" heading-level="3" has-cover-link>
            <template #headingTitle>Internet Architecture Board</template>
            <p class="text-base mt-2 text-blue-900 dark:text-white">
              Short description of the page here if it seems useful to show
            </p>
          </Card>

          <Card href="/sdf" heading-level="3" has-cover-link>
            <template #headingTitle>Independent Stream</template>
            <p class="text-base mt-2 text-blue-900 dark:text-white">
              Short description of the page here if it seems useful to show
            </p>
          </Card>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>

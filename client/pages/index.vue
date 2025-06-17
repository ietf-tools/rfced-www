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
          <p class="hidden mt-8 lg:block text-base text-grey-800 pl-5">
            Looking for works in progress? Go to
            <A :href="DATATRACKER_URL" class="text-blue-300 dark:text-blue-100">
              datatracker.ietf.org
            </A>
          </p>
        </div>
        <div class="grid grid-cols-1 mt-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-if="searchStatus === 'error' && searchError">
            <Alert variant="warning" heading="Unable to load latest RFCs">
              {{ searchError.statusMessage }}
            </Alert>
          </div>

          <div
            v-if="searchStatus === 'success' && topSearchResults?.length === 0"
          >
            <Alert variant="warning" heading="Unable to load latest RFCs">
              Try again later (API error)
            </Alert>
          </div>

          <div v-if="searchStatus === 'success'">
            <RFCCardSearchItem
              v-for="searchResult in topSearchResults"
              :key="searchResult.number"
              :search-item="searchResult"
              :show-abstract="false"
              :show-tag-date="true"
            />
          </div>
        </div>

        <Heading level="2" has-icon class="pl-5 mt-10 mb-5 md:p-0">
          Learn about RFCs
        </Heading>
        <div class="grid grid-cols-1 mt-3 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MarkdownCard id="/authors/rfc-edit/" />
          <MarkdownCard id="/authors/rfc-edit/auth48/" />
          <MarkdownCard id="/series/rfc-errata/" />
          <MarkdownCard id="/series/rfc-faq/" />
        </div>

        <Heading level="2" has-icon class="pl-5 mt-10 mb-5 md:p-0">
          Browse RFCs
        </Heading>
        <div class="grid grid-cols-1 mt-3 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            :href="searchPathBuilder({ sortby: 'stream' })"
            heading-level="3"
            has-cover-link
          >
            <template #headingTitle>By Stream</template>
            <p class="text-base mt-2 text-blue-900 dark:text-white">
              Short description of the page here if it seems useful to show
            </p>
          </Card>

          <Card
            :href="searchPathBuilder({ sortby: 'status' })"
            heading-level="3"
            has-cover-link
          >
            <template #headingTitle>By Status</template>
            <p class="text-base mt-2 text-blue-900 dark:text-white">
              Short description of the page here if it seems useful to show
            </p>
          </Card>

          <Card
            :href="searchPathBuilder({ sortby: 'service' })"
            heading-level="3"
            has-cover-link
          >
            <template #headingTitle>By Service</template>
            <p class="text-base mt-2 text-blue-900 dark:text-white">
              Short description of the page here if it seems useful to show
            </p>
          </Card>

          <MarkdownCard id="/series/rfc-download/" />
        </div>

        <Heading level="2" has-icon class="pl-5 mt-10 mb-5 md:p-0">
          Start Participating
        </Heading>
        <div class="grid grid-cols-1 mt-3 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MarkdownCard id="/authors/rfc-edit/" />
          <MarkdownCard id="/authors/rfc-edit/auth48/" />
          <MarkdownCard id="/series/rfc-errata/" />
          <MarkdownCard id="/series/rfc-faq/" />
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import {
  DATATRACKER_URL,
  SEARCH_API_PATH,
  searchPathBuilder
} from '~/utilities/url'

definePageMeta({
  layout: false
})

const {
  data: searchResponse,
  status: searchStatus,
  error: searchError
} = await useAsyncData(() => $fetch(SEARCH_API_PATH))

const topSearchResults = computed(() => {
  const allSearchResults = searchResponse.value?.results
  return Array.isArray(allSearchResults) ? allSearchResults.slice(0, 3) : []
})
</script>

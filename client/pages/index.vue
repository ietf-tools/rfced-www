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
            <a
              href="https://datatracker.ietf.org/"
              class="text-blue-300 dark:text-blue-100"
            >
              datatracker.ietf.org
            </a>
          </p>
        </div>
        <div class="grid grid-cols-1 mt-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-if="searchError">
            <Alert variant="warning" heading="Unable to load latest RFCs">
              {{ searchError.statusMessage }}
            </Alert>
          </div>

          <RFCCardSearchItem
            v-for="searchResult in searchResults"
            :key="searchResult.number"
            :search-item="searchResult"
            :show-abstract="false"
            :show-tag-date="true"
          />
        </div>

        <Heading level="2" has-icon class="pl-5 mt-10 mb-5 md:p-0">
          Learn about RFCs
        </Heading>
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

        <Heading level="2" has-icon class="pl-5 mt-10 mb-5 md:p-0">
          Browse RFCs
        </Heading>
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
import { SEARCH_API_PATH } from '~/utilities/url'

definePageMeta({
  layout: false
})

useSeoMeta({
  title: 'RFC Editor'
})

const { data: searchResponse, error: searchError } =
  await useFetch(SEARCH_API_PATH)

const searchResults = searchResponse.value?.results.splice(0, 3)
</script>

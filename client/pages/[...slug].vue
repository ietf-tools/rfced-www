<template>
  <div class="min-h-[100vh]">
    <div class="container mx-auto">
      <!-- <ContentBreadcrumbs /> -->
      <ContentDoc />
      <ContentDocLastUpdated />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PUBLIC_SITE } from '~/utilities/url'

// import _contentMetadata from '../generated/content-metadata.json'

const route = useRoute()
const slug: string = route.params.slug.join('/')

const canonicalUrl = `${PUBLIC_SITE}${!slug.startsWith('/') ? '/' : ''}${slug}${!slug.endsWith('/') ? '/' : ''}`

const { error } = await useAsyncData('home', () => queryContent(slug).findOne())

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not Found',
    fatal: true
  })
}

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }]
})
</script>

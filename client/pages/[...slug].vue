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

const route = useRoute()
const slug: string = (
  Array.isArray(route.params.slug) ?
    route.params.slug
  : [route.params.slug]).join('/')

const normalizedSlug = `${!slug.startsWith('/') ? '/' : ''}${slug}${!slug.endsWith('/') ? '/' : ''}`

if (
  !route.fullPath.endsWith('/') // if the path doesn't follow our URL style
) {
  await navigateTo({
    path: normalizedSlug
  })
}

const canonicalUrl = `${PUBLIC_SITE}${normalizedSlug}`

const { error } = await useAsyncData(
  normalizedSlug, // canonicalUrl is more normalized than `slug` because of the leading/trailing slash checks when this const is created, so it's better to use for the cache key
  () => queryContent(slug).findOne()
)

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

<template>
  <div class="min-h-[100vh]">
    <BodyLayoutDocument>
      <template #sidebar>
        <TableOfContentsMarkdownDesktop v-if="showToc && toc" :toc="toc" />
      </template>
      <div class="wrap-anywhere">
        <Breadcrumbs :breadcrumb-items="breadcrumbItems" />
        <ContentRenderer v-if="page" :value="page" />
      </div>
      <ContentDocLastUpdated />
    </BodyLayoutDocument>
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import type { BreadcrumbItem } from '~/components/BreadcrumbsTypes'
import {
  nuxtContentTocToRfcEditorToc,
  tocKey
} from '~/utilities/tableOfContents'
import { PUBLIC_SITE } from '~/utilities/url'

const route = useRoute()

const slug: string = (
  Array.isArray(route.params.slug) ?
    route.params.slug
  : [route.params.slug]).join('/')

const normalizedSlug = slug.replace(/^\//, '').replace(/\/$/, '')

const markdownPath = `/${normalizedSlug}`

const { error, data: page } = await useAsyncData(markdownPath, () =>
  queryCollection('content').path(markdownPath).first()
)

if (error.value || page.value === null) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not Found',
    fatal: true
  })
}

const canonicalPath = `/${normalizedSlug}/`
const canonicalUrl = `${PUBLIC_SITE}${canonicalPath}`

if (
  !route.fullPath.endsWith('/') // if the path doesn't follow our URL style
) {
  await navigateTo({
    path: canonicalPath
  })
}

const breadcrumbItems = computed((): BreadcrumbItem[] => {
  return [
    { url: "/", "label": "Home"},
    { url: undefined, label: page.value?.title ?? ""}
  ]  
})

const showToc = Boolean(page.value?.showToc)

const toc =
  page.value?.body.toc && nuxtContentTocToRfcEditorToc(page.value.body.toc)

/**
 * We want the mobile TOC to appear inline below the <h1> which is rendered in markdown by
 * ContentRenderer, so we'll provide() the details for ProseH1 to render it.
 */
provide(tocKey, { showToc, toc })

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }]
})
</script>

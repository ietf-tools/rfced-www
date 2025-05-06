<template>
  <div class="min-h-[100vh]">
    <BodyLayoutDocument>
      <template #sidebar>
        <TableOfContentsMarkdownDesktop v-if="showToc && toc" :toc="toc" />
      </template>
      <ContentRenderer v-if="page" :value="page" />
      <ContentDocLastUpdated />
    </BodyLayoutDocument>
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
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

if (error.value) {
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

const showToc: boolean = Boolean(page.value?.showToc)

const toc =
  page.value?.body.toc && nuxtContentTocToRfcEditorToc(page.value.body.toc)

provide(tocKey, { showToc, toc })

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }]
})
</script>

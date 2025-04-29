<template>
  <div class="min-h-[100vh]">
    <BodyLayoutDocument>
      <template #sidebar>
        <div class="fixed w-full min-h-[100vh] overflow-y-auto">
          <Heading level="2" class="m-0">Table of Contents</Heading>
          <TableOfContents
            v-if="page?.showToc && toc"
            :value="toc"
            list-type="ordered"
          />
        </div>
      </template>
      <ContentRenderer v-if="page" :value="page" />
      <ContentDocLastUpdated />
    </BodyLayoutDocument>
  </div>
</template>

<script setup lang="ts">
import { nuxtContentTocToRfcEditorToc } from '~/utilities/tableOfContents'
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

const toc =
  page.value?.body.toc && nuxtContentTocToRfcEditorToc(page.value.body.toc)

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }]
})
</script>

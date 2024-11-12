<template>
  <div class="min-h-[100vh]">
    <div class="container mx-auto">
      <Breadcrumbs :breadcrumb-items="breadcrumbItems" />
      <pre>
        {{ route.path }}
        {{ thisContentMetadata }}
      </pre>
      <ContentDoc />
    </div>
  </div>
</template>

<script setup lang="ts">
import { startCase } from 'lodash-es'
import _contentMetadata from '../content-metadata.json'
import type { BreadcrumbItem } from '~/components/BreadcrumbsTypes'
import type { ContentMetadata } from '~/scripts/generate-content-metadata'

const contentMetadata: ContentMetadata = _contentMetadata

const route = useRoute()

const thisContentMetadata = contentMetadata[route.path]

const pathParts = route.path.substring(1).split('/')

// const { data: navigation } = await useAsyncData('navigation', () =>
//   fetchContentNavigation()
// )

const breadcrumbItems: BreadcrumbItem[] = [
  { url: '/', label: 'Home' },
  ...pathParts.map((pathPart, index, arr) => ({
    url: `/${arr.slice(0, index + 1).join('/')}`,
    label: startCase(pathPart)
  }))
]
</script>

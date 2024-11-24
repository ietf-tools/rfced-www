<template>
  <div class="min-h-[100vh]">
    <div class="container mx-auto">
      <Breadcrumbs :breadcrumb-items="breadcrumbItems" />
      <ContentDoc />
      <ContentDocLastUpdated />
    </div>
  </div>
</template>

<script setup lang="ts">
import { startCase } from 'lodash-es'
import _contentMetadata from '../content-metadata.json'
import type { BreadcrumbItem } from '~/components/BreadcrumbsTypes'

const route = useRoute()

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

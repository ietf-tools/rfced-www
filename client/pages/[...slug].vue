<template>
  <div class="min-h-[100vh]">
    <div class="container mx-auto">
      <Breadcrumbs :breadcrumb-items="breadcrumbItems" />
      <ContentDoc />
    </div>
  </div>
</template>

<script setup lang="ts">
import { startCase } from 'lodash-es'
import type { BreadcrumbItem } from '~/components/BreadcrumbsTypes'

const route = useRoute()

const pathParts = route.path.substring(1).split('/')

const breadcrumbItems: BreadcrumbItem[] = [
  { url: '/', label: 'Home' },
  ...pathParts.map((pathPart, index, arr) => ({
    url: `/${arr.slice(0, index + 1).join('/')}`,
    label: startCase(pathPart)
  }))
]
</script>

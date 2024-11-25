<template>
  <Breadcrumbs :breadcrumb-items="breadcrumbItems" />
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content'
import type { BreadcrumbItem } from './BreadcrumbsTypes'

// import type { BreadcrumbItem } from '~/components/BreadcrumbsTypes'

const { data: navigation } = await useAsyncData('navigation', () =>
  fetchContentNavigation()
)

const route = useRoute()

function shallowNavitems(navItems: NavItem[] | null | undefined): NavItem[] {
  if (!navItems) return []

  return [
    ...navItems,
    ...navItems.map((navItem) => shallowNavitems(navItem.children))
  ].flat(10)
}

function navItemToBreadcrumbItem(navItem: NavItem): BreadcrumbItem {
  return {
    url: navItem._path,
    label: navItem.title
  }
}

const breadcrumbItems = shallowNavitems(navigation.value)
  .filter((item) => route.path.substring(0, item._path.length) === item._path)
  .sort((a, b) => {
    return a._path.length - b._path.length
  })
  .map(navItemToBreadcrumbItem)

// function navigationToBreadcrumbs(navigation: Navigation): BreadcrumbItem[] {
//   return navigation.map(
//     (item): BreadcrumbItem => ({
//       url: item._path,
//       label: item.title
//     })
//   )
// }
</script>

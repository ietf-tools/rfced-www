<template>
  <HeadlessMenu
    v-for="(menuItem, index) in menuData"
    :key="index"
    as="div"
    class="relative hidden lg:block"
  >
    <HeadlessMenuButton
      v-slot="{ open }"
      class="flex items-center gap-2 rounded hover:bg-gray-900 p-3"
    >
      {{ menuItem.label }}
      <GraphicsChevron :class="open ? 'rotate-180' : undefined" />
    </HeadlessMenuButton>
    <HeadlessMenuItems
      class="absolute z-10 w-40 py-2 rounded-md bg-white dark:bg-black dark:border-2 dark:border-red"
    >
      <HeadlessMenuItem
        v-for="(child, childIndex) in menuItem.children"
        :key="childIndex"
        v-slot="{ active }"
      >
        <a
          :class="[
            'block px-2 py-1 text-black dark:text-white',
            { 'bg-blue-500': active }
          ]"
          href="/"
        >
          {{ child.label }}
        </a>
      </HeadlessMenuItem>
    </HeadlessMenuItems>
  </HeadlessMenu>
  <a href="#search" type="button" class="hidden lg:flex items-center">
    <Icon name="fluent:search-12-filled" />
  </a>
  <HeaderNavThemeDesktop />
</template>

<script setup lang="ts">
import { menuData } from './HeaderNavData'
</script>

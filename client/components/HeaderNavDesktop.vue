<template>
  <HeadlessMenu
    v-for="(menuItem, index) in menuData"
    :key="index"
    as="div"
    class="relative hidden lg:block"
  >
    <HeadlessMenuButton
      v-slot="{ open }"
      as="template"
      class="flex items-center gap-2 rounded hover:bg-gray-900 p-3"
    >
      <button
        :class="[
          {
            'bg-blue-950 dark:bg-black border-2 border-yellow-700 dark:border-blue-900':
              open,
            'border-2 border-transparent': !open
          }
        ]"
      >
        {{ menuItem.label }}

        <span class="text-blue-100">
          <GraphicsChevron :class="open ? 'rotate-180' : undefined" />
        </span>
      </button>
    </HeadlessMenuButton>
    <HeadlessMenuItems
      class="absolute z-10 w-40 py-2 rounded-md bg-white dark:bg-black dark:border-2 dark:border-red shadow-[0_0px_10px_10px_#00101c99] dark:shadow-[0_0px_10px_10px_#00101c99]"
    >
      <HeadlessMenuItem
        v-for="(child, childIndex) in menuItem.children"
        :key="childIndex"
        v-slot="{ active }"
      >
        <a
          :class="[
            'block px-2 py-1 text-black dark:text-white',
            {
              'bg-blue-500 dark:bg-blue-600 text-white underline': active,
              'no-underline': !active
            }
          ]"
          href="/"
        >
          {{ child.label }}
        </a>
      </HeadlessMenuItem>
    </HeadlessMenuItems>
  </HeadlessMenu>
  <a
    href="#search"
    type="button"
    class="hidden lg:flex items-center hover:bg-gray-900 p-3"
  >
    <Icon name="fluent:search-12-filled" />
  </a>
  <HeaderNavThemeDesktop />
</template>

<script setup lang="ts">
import { menuData } from './HeaderNavData'
</script>

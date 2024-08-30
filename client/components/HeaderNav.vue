<template>
  <HeadlessMenu
    v-for="(menuItem, index) in menuData"
    :key="index"
    as="div"
    class="relative inline-block"
  >
    <HeadlessMenuButton class="rounded focus-visible:outline p-3">
      {{ menuItem.label }}
    </HeadlessMenuButton>
    <HeadlessMenuItems
      class="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-neutral-800/90 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <HeadlessMenuItem
        v-for="(child, childImdex) in menuItem.children"
        :key="childImdex"
        v-slot="{ active }"
      >
        <a
          :class="{ 'block bg-blue-500': active, 'block f': !active }"
          href="/"
        >
          {{ child.label }}
        </a>
      </HeadlessMenuItem>
    </HeadlessMenuItems>
  </HeadlessMenu>
  <button>?</button>
</template>

<script setup lang="ts">
import { menuData } from './HeaderNavData'
</script>

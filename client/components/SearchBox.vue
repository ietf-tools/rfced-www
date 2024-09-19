<template>
  <form method="get" action="/search" class="w-full flex pt-4 pb-6">
    <input
      id="search"
      v-model="searchStore.q"
      type="search"
      name="q"
      class="flex-1 bg-white text-black dark:bg-black dark:text-white"
      placeholder="Find an RFC (e.g. ‘RFC 7120’)"
      aria-label="Find an RFC (e.g. ‘RFC 7120’)"
    />
    <button type="submit" class="bg-blue-200 px-2 flex items-center">
      <Icon name="fluent:search-12-filled" size="2em" />
    </button>
  </form>
</template>

<script setup lang="ts">
import { useSearchStore } from '~/stores/search'

const searchStore = useSearchStore()
</script>

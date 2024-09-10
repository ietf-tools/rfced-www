<template>
  <form method="get" action="/search" class="w-full flex pt-4 pb-6 lg:w-1/2">
    <input
      type="search"
      v-model="value"
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
const route = useRoute()

const value = ref(route.query.q)
</script>

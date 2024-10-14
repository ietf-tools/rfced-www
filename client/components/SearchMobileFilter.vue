<template>
  <HeadlessDialog as="div" :open="isOpen" @close="isOpen = false">
    <HeadlessDialogPanel
      :class="// needs overflow-y-scroll to force scrollbars, to ensure same page width as the main view
      'absolute inset-0 z-50 bg-white text-black dark:bg-blue-950 dark:text-white overflow-y-scroll h-full'"
    >
      <HeadlessDialogTitle class="bb-4 border-b border-b-gray-200">
        <button
          type="button"
          class="flex justify-between w-full py-5 px-4 items-center"
          @click="isOpen = false"
        >
          <div class="pl-1 font-bold text-base">Filter RFCs</div>
          <GraphicsClose />
        </button>
      </HeadlessDialogTitle>
      <div class="flex flex-col">
        <SearchFilter />
      </div>
      <div
        class="flex flex-row justify-between mt-4 border-t border-t-gray-200 w-full px-2 py-2"
      >
        <button
          type="button"
          class="underline text-blue-700 dark:text-blue-300 px-3 py-2"
          @click="clearFiltersAndCloseDialog()"
        >
          Clear all
        </button>
        <button
          type="button"
          class="border font-bold px-3 py-2 bg-blue-400 text-white"
          @click="isOpen = false"
        >
          <template v-if="searchStore.searchResults === null">
            loading...
          </template>
          <template v-else>
            Show {{ searchStore.searchResults.length }}
            <template v-if="searchStore.searchResults.length === 1">
              RFC
            </template>
            <template v-else> RFCs </template>
          </template>
        </button>
      </div>
    </HeadlessDialogPanel>
  </HeadlessDialog>
  <div>
    <button
      type="button"
      class="flex gap-1 bg-white text-black dark:bg-black dark:text-white text-base p-3"
      @click="isOpen = true"
    >
      <GraphicsFilter />
      Filters
    </button>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const searchStore = useSearchStore()

function clearFiltersAndCloseDialog() {
  searchStore.clearFilters()
  isOpen.value = false
}
</script>

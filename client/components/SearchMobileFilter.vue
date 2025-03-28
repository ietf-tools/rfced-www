<template>
  <DialogRoot v-model:open="isOpen">
    <DialogTrigger>
      <button
        type="button"
        class="flex justify-between w-full py-5 px-4 items-center"
        @click="isOpen = false"
      >
        <div class="pl-1 font-bold text-base">Filter RFCs</div>
        <GraphicsClose />
      </button>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />

      <DialogContent
        :class="// needs overflow-y-scroll to force scrollbars, to ensure same page width as the main view
        'absolute inset-0 z-50 bg-white text-black dark:bg-blue-950 dark:text-white overflow-y-scroll h-full'"
      >
        <DialogTitle class="flex justify-between text-xl pl-3 font-bold">
          <span class="block p-2"> Filter RFCs </span>
          <DialogClose class="px-3 py-2">
            <GraphicsClose class="text-white" />
          </DialogClose>
        </DialogTitle>
        <DialogDescription>
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
              <template v-if="searchStore.searchResponse === null">
                loading...
              </template>
              <template v-else>
                Show {{ searchStore.searchResponse.count }}
                <template v-if="searchStore.searchResponse.count === 1">
                  RFC
                </template>
                <template v-else> RFCs </template>
              </template>
            </button>
          </div>
        </DialogDescription>
        <DialogClose />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from 'reka-ui'

const isOpen = ref(false)
const searchStore = useSearchStore()

function clearFiltersAndCloseDialog() {
  searchStore.clearFilters()
  isOpen.value = false
}
</script>

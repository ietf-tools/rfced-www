<template>
  <DialogRoot v-model:open="isOpen">
    <DialogTrigger>
      <span class="block mr-4">
        <button
          type="button"
          class="flex justify-between w-full py-2 px-3 items-center border-1 border-gray-400 font-bold"
          @click="isOpen = false"
        >
          Filter RFCs
        </button>
      </span>
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
          <div class="flex flex-col mb-20">
            <div class="ml-5 mb-3">
              <SearchInRfcComments />
            </div>
            <fieldset class="ml-5 mr-5">
              <legend class="font-bold">UI Density</legend>
              <div class="flex items-center lg:h-10">
                <SearchDensity v-model="searchStore.density" />
              </div>
            </fieldset>
            <div class="pr-5">
              <SearchFilter />
            </div>
          </div>
          <div
            class="fixed bottom-0 flex flex-row justify-between mt-4 border-t border-t-gray-200 w-full"
          >
            <button
              type="button"
              @click="isOpen = false"
              class="border-1 w-full font-bold bg-black text-white px-2 py-2"
            >
              Ok
            </button>
          </div>
        </DialogDescription>
        <DialogClose class="fixed top-4 right-5">
          <GraphicsClose class="text-black" />
        </DialogClose>
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
</script>

<template>
  <DialogRoot v-model:open="isOpen">
    <DialogTrigger>
      <span class="block mr-4">
        <button
          type="button"
          class="flex justify-between w-full py-2 px-3 items-center border-1 border-gray-400 font-bold bg-white text-black dark:bg-black dark:text-white"
          @click="isOpen = false"
        >
          Filter RFCs
        </button>
      </span>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />

      <DialogContent
        class="absolute inset-0 z-50 bg-white text-black dark:bg-blue-950 dark:text-white h-full h-[100vh] flex flex-col"
      >
        <DialogTitle
          class="flex justify-between text-xl pl-3 font-bold border-b-1 border-b-gray-400"
        >
          <span class="block px-2 py-4"> Filter RFCs </span>
          <DialogClose class="px-3 py-2">
            <GraphicsClose class="text-white" />
          </DialogClose>
        </DialogTitle>
        <VerticalScrollable v-if="isOpen" class="flex-1">
          <div class="flex flex-col mb-6 pt-4">
            <fieldset class="ml-5 mr-5">
              <legend class="font-bold">Card Density</legend>
              <div class="flex items-center">
                <SearchDensity v-model="searchStore.density" />
              </div>
            </fieldset>
            <div class="ml-5 mb-1 pt-4">
              <SearchInRfcComments />
            </div>
            <div class="pr-5">
              <SearchFilter />
            </div>
          </div>
        </VerticalScrollable>
        <button
          type="button"
          class="flex-none w-full font-bold bg-black text-white px-2 py-2"
          @click="isOpen = false"
        >
          Ok
        </button>

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
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from 'reka-ui'

const isOpen = ref(false)

const searchStore = useSearchStore()
</script>

<template>
  <div class="block lg:hidden">
    <HeadlessDialog as="div" :open="isOpen" @close="isOpen = false">
      <HeadlessDialogPanel
        class="absolute inset-0 z-50 bg-blue-900 text-white dark:bg-blue-950"
      >
        <nav class="container mx-auto flex flex-col">
          <HeadlessDialogTitle>
            <button
              type="button"
              class="flex justify-between w-full py-5 pr-4 items-center"
              @click="isOpen = false"
            >
              <HeaderLogoMobileMenuGraphic />
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                role="img"
              >
                <title>Close mobile menu</title>
                <rect
                  x="0.797363"
                  y="14.2842"
                  width="20"
                  height="1.5"
                  transform="rotate(-45 0.797363 14.2842)"
                  fill="white"
                />
                <rect
                  width="20"
                  height="1.5"
                  transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 15.6465 14.2842)"
                  fill="white"
                />
              </svg>
            </button>
          </HeadlessDialogTitle>
          <Accordion.Root>
            <Accordion.Item
              v-for="(item, index) in menuData"
              :key="index"
              :value="index.toString()"
            >
              <Accordion.ItemTrigger
                class="flex flex-row w-full justify-between items-center py-1 border border-gray-500 hover:bg-white/10"
              >
                <span class="p-4">{{ item.label }}</span>
                <Accordion.ItemIndicator
                  class="w-[16px] border-l border-gray-500 py-4 pl-6 pr-8 text-blue-100"
                >
                  <ChevronGraphic class="-rotate-90" data-chevron />
                </Accordion.ItemIndicator>
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <ul class="mx-4">
                  <li
                    v-for="(childItem, childIndex) in item.children"
                    :key="childIndex"
                  >
                    <a
                      :href="childItem.href"
                      class="block border border-gray-500 px-6 py-3 hover:bg-white/10"
                      >{{ childItem.label }}</a
                    >
                  </li>
                </ul>
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>
        </nav>
      </HeadlessDialogPanel>
    </HeadlessDialog>
    <button type="button" class="text-white p-3" @click="isOpen = true">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" role="img">
        <title>Open mobile menu</title>
        <rect y="0.75" width="16" height="2" fill="currentColor" />
        <rect y="7.25" width="16" height="2" fill="currentColor" />
        <rect y="13.75" width="16" height="2" fill="currentColor" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Accordion } from '@ark-ui/vue'
import { menuData } from './HeaderNavData'

const isOpen = ref(false)
</script>

<style>
/* Ark Accordion doesn't expose template vars, it just sets data-* attributes,
 so we use those to animate chevron rotation */
[data-state='open'] [data-chevron] {
  transform: rotate(0deg);
}
</style>

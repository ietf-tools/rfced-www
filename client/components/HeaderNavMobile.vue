<template>
  <div class="block lg:hidden">
    <HeadlessDialog as="div" :open="isOpen" @close="isOpen = false">
      <HeadlessDialogPanel
        :class="// needs overflow-y-scroll to force scrollbars, to ensure same page width as the main view
        'absolute inset-0 z-50 bg-blue-900 text-white dark:bg-blue-950 overflow-y-scroll h-full'"
      >
        <nav class="container mx-auto flex flex-col">
          <HeadlessDialogTitle>
            <button
              type="button"
              class="flex justify-between w-full py-5 px-4 items-center"
              @click="isOpen = false"
            >
              <GraphicsHeaderLogoMobileMenu />
              <GraphicsClose />
            </button>
          </HeadlessDialogTitle>
          <div class="flex flex-col">
            <Accordion.Root multiple collapsible>
              <Accordion.Item
                v-for="(item, index) in mobileMenuItem"
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
                    <GraphicsChevron class="-rotate-90" data-chevron />
                  </Accordion.ItemIndicator>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <ul class="mx-4">
                    <li
                      v-for="(childItem, childIndex) in item.children"
                      :key="childIndex"
                    >
                      <a
                        v-if="childItem.href"
                        :href="childItem.href"
                        class="block border border-gray-500 px-6 py-3 w-full text-left hover:bg-white/10"
                      >
                        {{ childItem.label }}
                      </a>
                      <button
                        v-else
                        type="button"
                        class="block border border-gray-500 px-6 py-3 w-full text-left hover:bg-white/10"
                        @click="childItem.click"
                      >
                        {{ childItem.label }}
                      </button>
                    </li>
                  </ul>
                </Accordion.ItemContent>
              </Accordion.Item>
              <Accordion.Item
                v-for="(item, index) in menuData"
                :key="index"
                :value="index.toString()"
              >
              </Accordion.Item>
            </Accordion.Root>
          </div>
        </nav>
      </HeadlessDialogPanel>
    </HeadlessDialog>
    <button
      type="button"
      class="text-white p-3 md:-mx-3"
      @click="isOpen = true"
    >
      <GraphicsHamburgerMenu />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Accordion } from '@ark-ui/vue'
import { menuData, colorPreferences } from './HeaderNavData'

const colorMode = useColorMode()

const mobileMenuItem = [
  ...menuData,
  {
    label: 'Theme',
    children: colorPreferences.map((colorPreference) => ({
      label: colorPreference.label,
      href: '',
      click: () => {
        colorMode.preference = colorPreference.value
        isOpen.value = false
      }
    }))
  }
]

const isOpen = ref(false)
</script>

<style>
/**
   Ark Accordion doesn't expose template slots for open/closed state, it just
   sets data-* attributes, so we use those to animate chevron rotation instead
   of the conventional Vue approach
**/
[data-state='open'] [data-chevron] {
  transform: rotate(0deg);
}
</style>

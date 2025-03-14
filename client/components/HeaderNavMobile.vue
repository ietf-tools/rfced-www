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
            <Accordion>
              <AccordionItem
                v-for="(item, index) in menuData"
                :id="index.toString()"
                :trigger-text="item.label"
              >
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

                    <Accordion v-if="childItem.children">
                      <AccordionItem
                        :key="index"
                        :id="index.toString()"
                        :trigger-text="childItem.label"
                        :depth="2"
                        :style-depth="2"
                      >
                        <ul class="mx-4">
                          <li
                            v-for="(
                              subChildItem, childIndex
                            ) in childItem.children"
                            :key="childIndex"
                          >
                            <a
                              v-if="subChildItem.href"
                              :href="subChildItem.href"
                              class="block border border-gray-500 px-6 py-3 w-full text-left hover:bg-white/10"
                            >
                              {{ subChildItem.label }}
                            </a>
                          </li>
                        </ul>
                      </AccordionItem>
                    </Accordion>
                  </li>
                </ul>
              </AccordionItem>
              <AccordionItem
                v-for="(item, index) in menuItemsThatAreOnlyOnMobile"
                :key="menuData.length + index"
                :id="(menuData.length + index).toString()"
                :trigger-text="item.label"
              >
                <ul class="mx-4">
                  <li
                    v-for="(childItem, childIndex) in item.children"
                    :key="childIndex"
                  >
                    <button
                      type="button"
                      class="block border border-gray-500 px-6 py-3 w-full text-left hover:bg-white/10"
                      @click="childItem.click"
                    >
                      {{ childItem.label }}
                    </button>
                  </li>
                </ul>
              </AccordionItem>
            </Accordion>
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
import { menuData, colorPreferences } from './HeaderNavData'

const colorMode = useColorMode()

const menuItemsThatAreOnlyOnMobile = [
  {
    label: 'Theme',
    children: colorPreferences.map((colorPreference) => ({
      label: colorPreference.label,
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

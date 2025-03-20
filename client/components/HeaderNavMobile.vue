<template>
  <div class="block lg:hidden">
    <HeadlessDialog as="div" :open="isOpen" @close="isOpen = false">
      <HeadlessDialogPanel
        class="absolute inset-0 z-50 bg-blue-900 text-white dark:bg-blue-950 overflow-y-scroll h-full"
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
            <AccordionItem
              v-for="(item, index) in menuData"
              :id="index.toString()"
              :key="index.toString()"
              :trigger-text="item.label"
            >
              <ul class="ml-4">
                <li
                  v-for="(childItem, childIndex) in item.children"
                  :key="childIndex"
                >
                  <a
                    v-if="childItem.href"
                    :href="childItem.href"
                    class="block border no-underline border-gray-500 px-6 py-3 w-full text-left hover:bg-white"
                  >
                    <GraphicsChevron
                      class="absolute right-0 mt-1 mr-4 size-4 -rotate-90"
                    />

                    {{ childItem.label }}
                  </a>
                  <AccordionItem
                    v-else
                    :id="index.toString()"
                    :key="index"
                    :trigger-text="childItem.label"
                    :style-depth="2"
                  >
                    <ul class="ml-4">
                      <li
                        v-for="(
                          subChildItem, subChildIndex
                        ) in childItem.children"
                        :key="subChildIndex"
                      >
                        <a
                          v-if="subChildItem.href"
                          :href="subChildItem.href"
                          class="block no-underline border border-gray-500 px-6 py-3 w-full text-left hover:bg-white/10"
                        >
                          <GraphicsChevron
                            class="absolute right-0 mt-1 mr-4 size-4 -rotate-90"
                          />
                          {{ subChildItem.label }}
                        </a>
                      </li>
                    </ul>
                  </AccordionItem>
                </li>
              </ul>
            </AccordionItem>
            <AccordionItem
              v-for="(mobileItem, index) in menuItemsThatAreOnlyOnMobile"
              :id="(menuData.length + index).toString()"
              :key="(menuData.length + index).toString()"
              :trigger-text="mobileItem.label"
            >
              <ul class="mx-4">
                <li
                  v-for="(
                    mobileItemChildItem, mobileItemChildIndex
                  ) in mobileItem.children"
                  :key="mobileItemChildIndex"
                >
                  <button
                    type="button"
                    class="block border border-gray-500 px-6 py-3 w-full text-left hover:bg-white/10"
                    @click="mobileItemChildItem.click"
                  >
                    {{ mobileItemChildItem.label }}
                  </button>
                </li>
              </ul>
            </AccordionItem>
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

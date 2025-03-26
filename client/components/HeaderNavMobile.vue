<template>
  <div class="block lg:hidden">
    <DialogRoot>
      <DialogPortal>
        <DialogOverlay
          class="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-30"
        />
        <DialogContent>
          <nav class="container mx-auto flex flex-col">
            <DialogTitle>
              <button
                type="button"
                class="flex justify-between w-full py-5 px-4 items-center"
                @click="isOpen = false"
              >
                <GraphicsHeaderLogoMobileMenu />
                <GraphicsClose />
              </button>
            </DialogTitle>
            <div class="flex flex-col">
              <AccordionItem
                v-for="(item, index) in menuData"
                :id="index.toString()"
                :key="index.toString()"
                :trigger-text="item.label"
              >
                <ul class="ml-4">
                  <li
                    v-for="(level0, childIndex) in item.children"
                    :key="childIndex"
                  >
                    <a
                      v-if="level0.href"
                      :href="level0.href"
                      class="block border no-underline border-gray-500 px-6 py-3 w-full text-left hover:bg-white"
                    >
                      <GraphicsChevron
                        class="absolute right-0 mt-1 mr-4 size-4 -rotate-90"
                      />

                      {{ level0.label }}
                    </a>
                    <AccordionItem
                      v-else
                      :id="index.toString()"
                      :key="index"
                      :trigger-text="level0.label"
                      :style-depth="2"
                    >
                      <ul class="ml-4">
                        <li
                          v-for="(level1, level1Index) in level0.children"
                          :key="level1Index"
                        >
                          <a
                            v-if="level1.href"
                            :href="level1.href"
                            class="block no-underline border border-gray-500 px-6 py-3 w-full text-left hover:bg-white/10"
                          >
                            <GraphicsChevron
                              class="absolute right-0 mt-1 mr-4 size-4 -rotate-90"
                            />
                            {{ level1.label }}
                          </a>
                          <button
                            v-else-if="level1.click"
                            type="button"
                            class="block border border-gray-500 px-6 py-3 w-full text-left hover:bg-white/10"
                            @click="level1.click"
                          >
                            {{ level1.label }}
                          </button>
                        </li>
                      </ul>
                    </AccordionItem>
                  </li>
                </ul>
              </AccordionItem>
            </div>
          </nav>
        </DialogContent>
      </DialogPortal>
      <DialogTrigger as-child>
        <button
          type="button"
          class="text-white p-3 md:-mx-3"
          @click="isOpen = true"
        >
          <GraphicsHamburgerMenu />
        </button>
      </DialogTrigger>
    </DialogRoot>
  </div>
</template>

<script setup lang="ts">
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from 'reka-ui'
import { useMenuData } from './HeaderNavData'

const menuData = useMenuData()

const isOpen = ref(false)
</script>

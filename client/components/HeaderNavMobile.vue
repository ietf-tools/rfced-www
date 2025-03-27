<template>
  <DialogRoot v-model:open="isOpen">
    <DialogTrigger
      aria-label="Menu"
      class="absolute top-0 right-0 block border p-4 block lg:hidden"
    >
      <GraphicsHamburgerMenu />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />
      <DialogContent
        :class="// needs overflow-y-scroll to force scrollbars, to ensure same page width as the main view
        'absolute inset-0 z-50 bg-blue-900 text-white dark:bg-blue-950 dark:text-white overflow-y-scroll h-full'"
      >
        <DialogTitle>
          <button
            type="button"
            class="flex justify-between w-full py-5 px-4 items-center"
          >
            <GraphicsHeaderLogoMobileMenu />
            <DialogClose>
              <GraphicsClose class="text-white" />
            </DialogClose>
          </button>
        </DialogTitle>
        <div class="flex flex-col">
          <Accordion>
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
                  <button
                    v-else-if="level0.click"
                    type="button"
                    :aria-label="level0.activeLabelFn?.()"
                    class="block border no-underline border-gray-500 px-6 py-3 w-full text-left hover:bg-white"
                    @click="
                      (e: MouseEvent) => {
                        level0.click?.(e)
                        isOpen = false
                      }
                    "
                  >
                    <Icon v-if="level0.icon" :name="level0.icon" />
                    <Icon
                      v-if="level0.isActiveFn?.()"
                      name="fluent:checkmark-12-filled"
                    />
                    <span
                      v-if="
                        level0.isActiveFn && !level0.isActiveFn() // render blank space
                      "
                      class="inline-block w-[14px] h-[14px]"
                    />
                    {{ level0.label }}
                  </button>
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
                          v-else
                          type="button"
                          :aria-label="level1.activeLabelFn?.()"
                          @click="level1.click"
                        >
                          <Icon v-if="level1.icon" :name="level1.icon" />
                          <Icon
                            v-if="level1.isActiveFn?.()"
                            name="fluent:checkmark-12-filled"
                          />
                          <span
                            v-if="
                              level1.isActiveFn && !level1.isActiveFn() // render blank space
                            "
                            class="inline-block w-[14px] h-[14px]"
                          />
                          {{ level1.label }}
                        </button>
                      </li>
                    </ul>
                  </AccordionItem>
                </li>
              </ul>
            </AccordionItem>
          </Accordion>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from 'reka-ui'
import { useMenuData } from './HeaderNavData'

const menuData = useMenuData()

const isOpen = ref(false)
</script>

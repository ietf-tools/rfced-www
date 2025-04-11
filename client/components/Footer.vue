<template>
  <footer class="bg-blue-900 text-white dark:bg-blue-950 relative print:hidden">
    <div class="container mx-auto flex flex-col md:flex-row py-4 lg:py-8 gap-4">
      <div class="flex-1 flex flex-col gap-5 pr-4">
        <p class="text-base">
          rfc-editor.org is maintained by the
          <A
            href="https://www.ietf.org/"
            class="underline text-blue-100 font-semibold md:text-nowrap"
            >Internet Engineering Task Force</A
          >
          and funded by the
          <A
            href="https://www.internetsociety.org/"
            class="underline text-blue-100 font-semibold md:text-nowrap"
          >
            Internet Society
          </A>
        </p>
        <div class="flex gap-7 items-center mt-2 lg:mt-5">
          <A href="https://www.ietf.org/">
            <GraphicsIETFLogo width="105" height="60" />
          </A>
          <A href="https://www.internetsociety.org/">
            <GraphicsInternetSocietyLogo width="112" height="36" />
          </A>
        </div>
      </div>
      <div class="flex-1 flex flex-col lg:flex-row gap-10 p-3 lg:p-0">
        <div v-for="(menuItem, index) in menuData" :key="index">
          <Heading level="4" class="text-base text-white">
            {{ menuItem.label }}
          </Heading>
          <ul class="mt-3 flex flex-col gap-2">
            <li
              v-for="(child, childIndex) in menuItem.children"
              :key="childIndex"
              class="text-base"
            >
              <A
                :href="child.href"
                :target="!isInternalLink(child.href) ? '_blank' : undefined"
                class="underline text-white md:text-nowrap"
              >
                {{ child.label }}
              </A>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { isInternalLink } from '../utilities/url'
import { menuData } from './FooterNavData'
</script>

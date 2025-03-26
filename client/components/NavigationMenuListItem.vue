<template>
  <li>
    <NavigationMenuLink as-child>
      <a
        v-bind="$attrs"
        class="shadow-2xl focus:shadow-xl hover:bg-gray-700 block select-none rounded-sm p-3 leading-none no-underline outline-none transition-colors"
      >
        {{ props.title }}
      </a>
    </NavigationMenuLink>
  </li>
</template>

<script setup lang="ts">
import { NavigationMenuLink } from 'reka-ui'

const props = defineProps({
  title: String
})
</script>

<template>
  <ToggleGroupRoot
    v-model="value"
    type="single"
    class="flex bg-white border border-gray-400 dark:bg-black dark:border-white shadow-sm rounded-xs"
  >
    <ToggleGroupItem
      value="full"
      aria-label="Full Display"
      :class="toggleGroupItemClasses"
    >
      <Icon
        name="f7:rectangle-grid-1x2-fill"
        class="w-[15px] h-[15px]"
      />
    </ToggleGroupItem>
    <ToggleGroupItem
      value="dense"
      aria-label="Dense Display"
      :class="toggleGroupItemClasses"
      class="border-x"
    >
      <Icon
        name="fa-solid:th-list"
        class="w-[15px] h-[15px]"
      />
    </ToggleGroupItem>
    <ToggleGroupItem
      value="compact"
      aria-label="Compact Display"
      :class="toggleGroupItemClasses"
    >
      <Icon
        name="vaadin:list"
        class="w-[15px] h-[15px]"
      />
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>

<script lang="ts" setup>
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'

const value = defineModel<string>()

const toggleGroupItemClasses = 'hover:bg-gray-100 text-sky-950 data-[state=on]:bg-gray-200 flex h-[37px] w-[37px] items-center justify-center bg-white first:rounded-l-xs last:rounded-r-xs'
</script>
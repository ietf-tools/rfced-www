<template>
  <div
    class="w-full container m-auto flex flex-row-reverse justify-between lg:gap-5"
  >
    <div class="flex-1 p-3 bg-white hidden lg:block">
      <slot name="sidebar" />
    </div>
    <div class="flex-auto">
      <slot />
    </div>
  </div>
</template>

<template>
  <div class="w-full container m-auto flex flex-row-reverse justify-between">
    <div class="p-3 bg-white">
      <slot name="sidebar" />
    </div>
    <div class="">
      <slot />
    </div>
  </div>
</template>

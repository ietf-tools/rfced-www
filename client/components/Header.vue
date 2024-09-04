<template>
  <header class="bg-blue-900 text-white dark:bg-blue-950 relative">
    <a
      href="#main"
      class="absolute bg-white text-black m-2 px-3 py-1 will-change-transform motion-safe:transition-transform -translate-y-10 focus:translate-y-0 hover:translate-y-0"
    >
      Skip to content
    </a>
    <nav class="container mx-auto flex justify-between py-4">
      <a href="/">
        <img :src="Logo" alt="RFC Editor - Official home of RFCs" />
      </a>
      <div class="flex gap-2">
        <HeaderNav />
      </div>
    </nav>
    <!-- slot used to extend the header eg for the homepage -->
    <slot />
  </header>
</template>

<script setup lang="ts">
import Logo from 'assets/logo.svg'
</script>

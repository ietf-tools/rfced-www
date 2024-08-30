<template>
  <header class="bg-black text-white">
    <nav class="container mx-auto flex justify-between">
      <a href="/">
        <img :src="Logo" alt="RFC Editor - Official home of RFCs" />
      </a>
      <div class="flex gap-2">
        <HeaderNav />
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import Logo from 'assets/logo.svg'
</script>

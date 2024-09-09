<template>
  <header class="bg-blue-900 text-white dark:bg-blue-950 relative">
    <HeaderSkipToContent />
    <nav class="container mx-auto flex justify-between py-4 px-0 w-full">
      <GraphicsHeaderLogos />
      <div class="flex gap-2">
        <HeaderNavMobile />
        <HeaderNavDesktop />
      </div>
    </nav>
    <!-- slot used to extend the header eg for the homepage -->
    <slot />
  </header>
</template>

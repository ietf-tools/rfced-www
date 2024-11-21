<template>
  <header class="bg-blue-900 text-white dark:bg-blue-950 relative print:hidden">
    <HeaderSkipToContent />
    <nav class="container mx-auto flex justify-between py-4 px-0 w-full">
      <GraphicsHeaderLogos />
      <div class="flex md:gap-8">
        <HeaderNavMobile />
        <HeaderNavDesktop />
      </div>
    </nav>
    <!-- slot used to extend the header eg for the homepage -->
    <slot />
  </header>
</template>

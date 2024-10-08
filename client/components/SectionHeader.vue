<template>
  <div class="bg-blue-100 pt-7 overflow-hidden relative">
    <div class="absolute pointer-events-none inset-0 overflow-hidden">
      <GraphicsIETFMotif
        class="absolute w-[90vw] h-[90vh] -left-[10vw] -top-[20vh]"
        :opacity="0.04"
      />
      <GraphicsIETFMotif
        class="absolute w-[40vw] h-[40vh] left-[57vw] md:left-[47vw] xl:left-[37vw] top-[17vh]"
        :opacity="0.04"
      />
    </div>
    <div class="container mx-auto text-white">
      <slot />
    </div>
  </div>
</template>

<template>
  <div class="flex flex-col min-h-[100vh]">
    <Header>
      <slot name="subheader"></slot>
    </Header>
    <Main>
      <slot />
    </Main>
    <Footer />
  </div>
</template>

<style>
html {
  /* https://fonts.nuxt.com/get-started/configuration */
  font-family: 'Inter', sans-serif;
}
</style>

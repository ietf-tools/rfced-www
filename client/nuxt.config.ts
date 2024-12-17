/// <reference types="histoire" />

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  typescript: { strict: true },
  modules: [
    '@nuxt/test-utils/module',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    'nuxt-headlessui',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/content'
  ],
  colorMode: {
    classSuffix: ''
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  routeRules: {}
})

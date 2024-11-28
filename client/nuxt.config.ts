/// <reference types="histoire" />

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  typescript: { strict: true },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    'nuxt-headlessui',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/content',
    'nuxt-module-feed'
  ],
  colorMode: {
    classSuffix: ''
  },
  feed: {
    // https://nuxt.com/modules/module-feed
    sources: [
      {
        path: '/rfcrss.xml', // The route to your feed.
        type: 'rss2', // Can be: rss2, atom1, json1
        cacheTime: 60 * 15 // How long should the feed be cached
      }
    ]
  },
  eslint: {
    config: {
      stylistic: true
    }
  }
})

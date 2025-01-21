/// <reference types="histoire" />

import redirects from './redirects.json'

type RouteRules = NonNullable<Parameters<typeof defineNuxtConfig>[0]["routeRules"]>

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
      stylistic: true
    }
  },
  nitro: {
    storage: {
      db: {
        driver: 'fs',
        base: './.data/db'
      }
    },
    devStorage: {
      db: {
        driver: 'fs',
        base: './.data/db'
      }
    }
  },
  routeRules: {
    // https://nitro.build/config#routerules
    ...redirects.redirects.reduce((acc, redirect) => {
      acc[redirect[0]] = { redirect: { to: redirect[1], statusCode: 301 } }
      return acc
    }, {} as RouteRules)
  }
})

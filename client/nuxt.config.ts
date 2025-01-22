/// <reference types="histoire" />

import redirects from './redirects.json'

type RouteRules = NonNullable<
  Parameters<typeof defineNuxtConfig>[0]['routeRules']
>

const oneHourInSeconds = 60 * 60
const oneDayInSeconds = 24 * oneHourInSeconds

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
  routeRules: {
    // https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering
    '/rfc-index.txt': {
      swr: oneDayInSeconds,
      prerender: true
    },
    '/rfcatom.xml': {
      swr: oneDayInSeconds,
      prerender: true
    },
    '/rfcrss.xml': {
      swr: oneDayInSeconds,
      prerender: true
    },
    // https://nitro.build/config#routerules
    ...redirects.redirects.reduce((acc, redirect) => {
      acc[redirect[0]] = { redirect: { to: redirect[1], statusCode: 301 } }
      return acc
    }, {} as RouteRules)
  }
})

/// <reference types="histoire" />

import redirects from './redirects.json'
import { isMiddlewareRedirect } from './utilities/redirects'

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
  nitro: {
    // Production
    storage: {
      db: {
        driver: 'fs',
        base: './data/db'
      }
    },
    // Development
    devStorage: {
      db: {
        driver: 'fs',
        base: './data/db'
      }
    }
  },
  // https://nitro.build/config#routerules
  // https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering
  routeRules: {
    // The prerenders can increase build time A LOT but it's better than
    // users waiting for responses.
    '/': {
      swr: oneDayInSeconds,
      prerender: true
    },
    '/rfc-index.txt': {
      swr: oneDayInSeconds,
      prerender: true
    },
    '/rfc-index/': {
      swr: oneDayInSeconds,
      prerender: true
    },
    '/rfc-index2/': {
      swr: oneDayInSeconds,
      prerender: true
    },
    '/rfc-index-100a/': {
      swr: oneDayInSeconds,
      prerender: true
    },
    '/rfc-index-100d/': {
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
    '/reports/CurrQstats.txt': {
      swr: oneDayInSeconds,
      prerender: true
    },
    '/rfc/rfc**.json': {
      swr: oneDayInSeconds,
      prerender: false // there are too many RFCs to prerender them, but we can at least `swr: true` cache them
    },
    ...redirects.redirects
      .filter(
        (redirect) =>
          // nuxt.config.ts can only handle basic redirects and more complex redirects need to be handled in middleware
          // so we filter complex redirects (those with wildcards) from this config.
          //
          // While Nuxt does support trailing '**' patterns see https://github.com/nitrojs/nitro/pull/1976
          // these routing patterns aren't expressive enough to
          !isMiddlewareRedirect(redirect[0])
      )
      .reduce((acc, redirect) => {
        acc[redirect[0]] = { redirect: { to: redirect[1], statusCode: 301 } }
        return acc
      }, {} as RouteRules)
  }
})

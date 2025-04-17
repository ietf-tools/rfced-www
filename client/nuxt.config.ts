/// <reference types="histoire" />
import tailwindcss from '@tailwindcss/vite'
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
    // Note: if considering adding 'Nuxt Device' see note in deviceMode.ts
    'reka-ui/nuxt',
    '@nuxt/test-utils/module',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/content'
  ],
  content: {
    markdown: {
      remarkPlugins: {
        'remark-heading-id': {
          // Options
        }
      }
    }
  },
  colorMode: {
    classSuffix: ''
  },
  eslint: {
    config: {
      stylistic: true
    }
  },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()]
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
  // https://nuxt.com/docs/guide/going-further/runtime-config
  runtimeConfig: {
    cfServiceTokenId: '', // NUXT_CF_SERVICE_TOKEN_ID env var
    cfServiceTokenSecret: '', // NUXT_CF_SERVICE_TOKEN_SECRET env var
    public: {
      // These settings are available client-side (others are server-side only)
      datatrackerBase: 'http://localhost:8000/' // NUXT_PUBLIC_DATATRACKER_BASE env var
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
    '/rfc-index.xml': {
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
      prerender: false // there are too many RFCs to prerender them, but we can at least cache them via `swr: true`
    },
    ...redirects.redirects
      .filter((redirect) => !isMiddlewareRedirect(redirect[0]))
      .reduce((acc, redirect) => {
        acc[redirect[0]] = { redirect: { to: redirect[1], statusCode: 301 } }
        return acc
      }, {} as RouteRules)
  }
})

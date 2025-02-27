/**
  nuxt.config.ts can only handle basic redirects and more complex redirects need to be handled in middleware
  
  While Nuxt does support trailing '**' patterns (see https://github.com/nitrojs/nitro/pull/1976 ) these
  aren't expressive enough for our usecase which is to distinguish between /rfc/rfcN.json 
 */
export const isMiddlewareRedirect = (redirectPattern: string): boolean =>
  redirectPattern.includes('*')

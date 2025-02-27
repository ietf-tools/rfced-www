import 'core-js/actual/regexp/escape'
import redirects from '../redirects.json'
import { isMiddlewareRedirect } from '~/utilities/redirects'

const middlewareRedirects = redirects.redirects
  .filter((redirect) => isMiddlewareRedirect(redirect[0]))
  .map((redirect): [RegExp, string] => {
    // Convert wildcard '*' patterns into a regex for matching routes
    // eg ["/rfc/rfc*.json", "/api/v1/rfc/rfc$1.json"]
    // becomes [new RegExp('^/rfc/rfc(.*?)\.json$'), '/api/v1/rfc/rfc$1.json']

    // @ts-expect-error RegExp.escape isn't natively supported by Node 22, hence the core-js polyfill above, so TS complains thinking it doesn't exist
    const escapedPattern = RegExp.escape(redirect[0])

    // Convert `*` to a regex pattern
    const regexForPath = escapedPattern.replaceAll(
      '\\*', // we need to match the escaped '*' as '\\*'
      '(.*?)'
    )
    const regex = new RegExp(`^${regexForPath}$`)
    return [regex, redirect[1]]
  })

export default defineNuxtRouteMiddleware((to, _from) => {
  for (let i = 0; i < middlewareRedirects.length; i++) {
    const middlewareRedirect = middlewareRedirects[i]
    const isMatch = middlewareRedirect[0].test(to.fullPath)
    if (isMatch) {
      const newPath = to.fullPath.replace(
        middlewareRedirect[0],
        middlewareRedirect[1]
      )
      return navigateTo(newPath)
    }
  }
})

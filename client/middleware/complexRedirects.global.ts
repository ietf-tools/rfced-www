import 'core-js/actual/regexp/escape'
import { isMiddlewareRedirect } from '~/utilities/redirects'
import redirects from '../redirects.json'

const middlewareRedirects = redirects.redirects
  .filter((redirect) => isMiddlewareRedirect(redirect[0]))
  .map((redirect): [RegExp, string] => {
    // @ts-expect-error RegExp.escape isn't natively supported by Node 22, hence the core-js polyfill above, so TS complains thinking it doesn't exist
    const escapedPattern = RegExp.escape(redirect[0])
    const regexPath = escapedPattern.replaceAll(
      '\\*', // we need to match the escaped '*' as '\\*'
      '(.*?)'
    )
    return [
      // Convert asterisk into regex match
      new RegExp(`^${regexPath}$`),
      redirect[1]
    ]
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

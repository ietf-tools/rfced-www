import type { RouterConfig } from '@nuxt/schema'

/**
 * Non-RFC citations are plain `<a href="#…">` anchors. The browser saves the
 * scroll position for that history entry, so Back should return the reader to
 * where they clicked. vue-router runs `scrollBehavior` on every popstate, but has
 * no `savedPosition` for an entry it did not create, and Nuxt's default then forces
 * `{ top: 0 }` when a hash is removed on the same page. Returning `false` leaves
 * the scroll position alone so the browser's own restoration stands. Delete this
 * file once Nuxt fixes it upstream, https://github.com/nuxt/nuxt/issues/36660
 * https://github.com/ietf-tools/red/issues/441
 */
export default {
  scrollBehavior(to, from, savedPosition) {
    // Same-page (hash) navigation
    if (to.path.replace(/\/$/, '') === from.path.replace(/\/$/, '')) {
      if (from.hash && !to.hash) {
        return savedPosition ?? false
      }
      if (to.hash) {
        return { el: to.hash, behavior: 'instant' }
      }
      return false
    }
    // Navigating to a different page.
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'instant' }
    }
    return { left: 0, top: 0 }
  }
} satisfies RouterConfig

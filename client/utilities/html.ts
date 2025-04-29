/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target
 */
export const TARGET_NEW_WINDOW = '_blank'

/**
 * The `noopener` prevents linked sites (theirs) having control over originating sites (ours)
 * via JavaScript https://mathiasbynens.github.io/rel-noopener/
 *
 * it's intentional to not have `noreferrer` here
 **/
export const EXTERNAL_LINK_REL = 'noopener'

export type AnchorProps = {
  href?: string // related to vue-ignore, we'll add href manually to make Vue's reactivity aware of it after vue-ignore forgot about it. `href` is optional because tag could be `<a id="something"/>`
  id?: string // related to vue-ignore, we'll add id manually to make Vue's reactivity aware of it after vue-ignore forgot about it. `id` is optional.
  // naming
} & Partial<
  // Following code uses @vue-ignore which affects reactivity
  Omit<
    /* @vue-ignore */ HTMLAnchorElement, // see https://github.com/vuejs/core/issues/11123#issuecomment-2168310426
    | 'style'
    | 'translate'
    | 'role'
    | 'prefix' // these ommissions are types from HTMLAnchorElement that are incompatible with prop values (according to TypeScript). If you need them you could re-add them with custom types.
    | 'href' // related to vue-ignore, we'll omit href
    | 'id'
  >
>

import type { Slot } from 'vue'

export const getVNodeText = (
  obj: VNode | VNode[] | Slot | string | undefined | null
): string => {
  if (!obj) {
    return ''
  }

  if (typeof obj === 'string') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(getVNodeText).join('')
  }

  if ('children' in obj) {
    const { children } = obj
    if (typeof children === 'string') {
      return children
    } else if (Array.isArray(children)) {
      return children
        .map((item) => getVNodeText(item as ReturnType<typeof h>))
        .join('')
    }
  }

  return ''
}

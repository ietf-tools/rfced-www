/**
 * Note that our server output should never vary because of device type
 * because we want a generic response that is cacheable, where device styling
 * is done in CSS, device detection in client-side JavaScript.
 *
 * Therefore for our use-case we don't really want a library like @nuxt/device
 * that uses HTTP user-agents to infer device capabilities, we just want client
 * side detection of capabilities
 */

import { onLoad } from '~/utilities/html'

export type HasTouchValue = null | boolean

export const isTouchDevice = (): boolean => {
  console.log(
    'isTouchDevice()',
    !!window.matchMedia('(pointer: coarse)').matches
  )

  if (typeof window === 'undefined') {
    throw Error(
      `This code should not be used serverside. We want cachable server responses that don't vary by device.`
    )
  }

  // https://stackoverflow.com/questions/63076960/detecting-touch-devices-and-detecting-can-hover-with-javascript-in-2020
  return !!window.matchMedia('(pointer: coarse)').matches
}

export const useHasTouch = defineStore('hasTouch', () => {
  const hasTouch = ref<HasTouchValue>(null)

  onLoad(() => {
    console.log('in onLoad')
    hasTouch.value = isTouchDevice()
  })

  return { hasTouch: hasTouch.value }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHasTouch, import.meta.hot))
}

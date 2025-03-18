import { createApp } from 'vue'
import type { Component } from 'vue'

const isVueComponent = (value: unknown): value is Component => {
  return (
    typeof value === 'object' &&
    value !== null &&
    '$el' in value &&
    '_uid' in value
  )
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('html-replace', {
    mounted(el, binding) {
      const replaceTags = binding.value || {}
      const parser = new DOMParser()
      const doc = parser.parseFromString(binding.value.content, 'text/html')
      const apps: ReturnType<typeof createApp>[] = []
      console.log('#####################', replaceTags)
      // Replace elements
      Object.entries(replaceTags).forEach(([tagName, component]) => {
        if (typeof tagName !== 'string') {
          throw Error(`Expected tagName to be string but was ${typeof tagName}`)
        }
        if (!isVueComponent(component)) {
          throw Error(`Expected Vue component but received ${typeof component}`)
        }

        doc.querySelectorAll(tagName).forEach((originalEl) => {
          const app = createApp(component)
          const container = document.createElement('div')
          originalEl.replaceWith(container)
          app.mount(container)
          apps.push(app)
        })
      })

      // Update element content
      el.innerHTML = ''
      el.appendChild(doc.body.firstChild)
      el.dataset.apps = apps
    },
    unmounted(el) {
      if (el.dataset.apps && Array.isArray(el.dataset.apps)) {
        for (const app in el.dataset.apps) {
          const appInstance = app as unknown
          if (
            appInstance &&
            typeof appInstance === 'object' &&
            'unmount' in appInstance &&
            typeof appInstance.unmount === 'function'
          ) {
            appInstance.unmount()
          }
        }
      }
    }
  })
})

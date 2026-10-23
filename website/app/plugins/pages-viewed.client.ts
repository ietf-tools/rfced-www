import { START_LOCATION } from 'vue-router'
import { recordNavigation } from '~/utilities/pages-viewed'

export default defineNuxtPlugin(() => {
  useRouter().afterEach((to, from, failure) => {
    if (failure) {
      return
    }
    recordNavigation(to.path, from === START_LOCATION ? undefined : from.path)
  })
})

import type { Density } from "~/utilities/typesense"

export const useSearchStore = defineStore('searchStore', {
  state: () => ({
    density: 'full' as Density,
    isSeries: false,
    searchContents: false,
    seriesLabel: '',
    seriesHref: ''
  }),
  persist: {
    pick: ['density', 'searchContents']
  }
})
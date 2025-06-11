export const useSearchStore = defineStore('searchStore', {
  state: () => ({
    isSeries: false,
    seriesLabel: '',
    seriesHref: ''
  })
})
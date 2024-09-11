export const Statuses = {
  any: 'Any',
  standards: 'Standards tracks',
  best: 'Best current practice',
  informational: 'Informational',
  experimental: 'Experimental',
  historic: 'Historic',
  unknown: 'unknown'
} as const
export type StatusValue = keyof typeof Statuses

export const Streams = {
  any: 'Any',
  todo: 'TODO'
} as const
export type StreamValue = keyof typeof Streams

export const Areas = {
  any: 'Any',
  todo: 'TODO'
} as const
export type AreaValue = keyof typeof Areas

export const OrderBy = {
  lowest: 'RFC no. (Lowest first)',
  highest: 'RFC no. (Highest first)'
} as const
export type OrderByValue = keyof typeof OrderBy

type SearchParams = {
  q: string
  from: string
  to: string
  statuses: string
  streams: string
  areas: string
  order: string
}

type SearchResult = {
  type: 'sdfsdf'
}

type SearchResults = null | SearchResult[]

export const useSearchStore = defineStore('search', () => {
  const router = useRouter()
  const route = useRoute()

  /**
   * Updates router query params with current search config
   * and ensures empty values (`''`) are removed from URL
   */
  function updateUrlParams(searchParams: Partial<SearchParams>) {
    const filterNull = <T extends Partial<SearchParams>>(obj: T): T =>
      Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== '') {
          acc[key as keyof SearchParams] = value
        }
        return acc
      }, {} as T)

    const query = filterNull({
      ...route.query,
      ...searchParams
    })

    router.push({ query })
  }

  function formatDate(date: Date | null): string {
    if (!date) {
      return ''
    }
    return date.toISOString().split('T')[0]
  }

  // PARAM: Q
  const q = ref<string>(route.query.q?.toString() ?? '')
  let qTimer: ReturnType<typeof setTimeout> | undefined = undefined
  watch(q, (newQ) => {
    updateUrlParams({ q: newQ })

    searchResults.value = null
    if (qTimer) {
      clearTimeout(qTimer)
    }
    qTimer = setTimeout(() => {
      // Fake search results
      searchResults.value = [{ type: 'sdfsdf' }, { type: 'sdfsdf' }]
    }, 2000)
  })

  // PARAM: publicationDateFrom
  const publicationDateFrom = ref<Date | null>(
    route.query.from ? new Date(route.query.from.toString()) : null
  )
  watch(publicationDateFrom, (newFrom) =>
    updateUrlParams({ from: formatDate(newFrom) })
  )

  // PARAM: publicationDateTo
  const publicationDateTo = ref<Date | null>(
    route.query.to ? new Date(route.query.to.toString()) : null
  )
  watch(publicationDateTo, (newTo) =>
    updateUrlParams({ to: formatDate(newTo) })
  )

  // PARAM: stream
  const stream = ref<StreamValue>(
    (route.query.area?.toString() ?? 'any') as StreamValue
  )
  watch(stream, (newStream) => updateUrlParams({ streams: newStream }))

  // PARAM: area
  const area = ref<AreaValue>(
    (route.query.area?.toString() ?? 'any') as AreaValue
  )
  watch(area, (newArea) => updateUrlParams({ areas: newArea }))

  // PARAM: statuses
  const statuses = ref<StatusValue[]>(
    (route.query.statuses?.toString() ?? '')
      .split(',')
      .filter(Boolean) as StatusValue[]
  )
  const toggleStatus = (status: StatusValue) => {
    /**
     * Mutate the statuses array per Vue docs:
     *
     * "Vue is able to detect when a reactive array's mutation methods are called and trigger
     *  necessary updates. These mutation methods are: push() pop() shift() unshift() splice()
     *  sort() reverse()"
     */
    if (statuses.value.includes(status)) {
      statuses.value.splice(statuses.value.indexOf(status), 1)
    } else {
      statuses.value.push(status)
    }
  }
  watch(
    statuses,
    (statuses) => {
      console.log(statuses)
      updateUrlParams({
        statuses: statuses.length > 0 ? statuses.join(',') : ''
      })
    },
    {
      deep: true // because we're mutating array we need to 'deep'ly watch the array to see value changes
    }
  )

  // PARAM: order by
  const orderBy = ref<OrderByValue>(
    (route.query.order?.toString() ?? 'lowest') as OrderByValue
  )
  watch(orderBy, (newOrder) =>
    updateUrlParams({ order: newOrder !== 'lowest' ? '' : newOrder })
  )

  // Search results
  const searchResults = ref<SearchResults>(null)

  const hasFilters = !!(
    statuses.value.length > 0 ||
    publicationDateFrom.value ||
    publicationDateTo.value ||
    stream.value !== 'any' ||
    area.value !== 'any'
  )

  return {
    q,
    statuses,
    toggleStatus,
    publicationDateFrom,
    publicationDateTo,
    stream,
    area,
    orderBy,
    searchResults,
    hasFilters
  }
})

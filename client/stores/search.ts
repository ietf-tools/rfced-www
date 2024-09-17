export const Statuses = {
  '': 'Any',
  experimental: 'Experimental',
  standards: 'Standards tracks',
  historic: 'Historic',
  best: 'Best current practice',
  unknown: 'Unknown',
  informational: 'Informational'
} as const
export type StatusValue = keyof typeof Statuses

export const Streams = {
  '': 'Any',
  todo: 'TODO'
} as const
export type StreamValue = keyof typeof Streams

export const Areas = {
  '': 'Any',
  todo: 'TODO'
} as const
export type AreaValue = keyof typeof Areas

export const WorkingGroups = {
  '': 'Any',
  todo: 'TODO'
} as const
export type WorkingGroupValue = keyof typeof WorkingGroups

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
  stream: string
  area: string
  workinggroup: string
  order: string
}

type SearchResult = {
  type: 'sdfsdf' // FIXME
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

  // Search results
  const searchResults = ref<SearchResults>(null)

  // A fake search stub
  let qTimer: ReturnType<typeof setTimeout> | undefined = undefined
  function doSearch() {
    searchResults.value = null
    if (qTimer) {
      clearTimeout(qTimer)
    }
    qTimer = setTimeout(() => {
      // Fake search results
      searchResults.value = [{ type: 'sdfsdf' }, { type: 'sdfsdf' }]
    }, 2000)
  }

  // PARAM: Q (search terms string)
  const q = ref<string>(route.query.q?.toString() ?? '')
  watch(q, (newQ) => {
    updateUrlParams({ q: newQ })
    doSearch()
  })

  if (q.value.length > 0) {
    doSearch()
  }

  // PARAM: publicationDateFrom
  const publicationDateFrom = ref<Date | undefined>(
    route.query.from
      ? new Date(parseDateString(route.query.from.toString()))
      : undefined
  )
  watch(publicationDateFrom, (newFrom) =>
    updateUrlParams({ from: stringifyDate(newFrom) })
  )

  // PARAM: publicationDateTo
  const publicationDateTo = ref<Date | undefined>(
    route.query.to
      ? new Date(parseDateString(route.query.to.toString()))
      : undefined
  )
  watch(publicationDateTo, (newTo) =>
    updateUrlParams({ to: stringifyDate(newTo) })
  )

  // PARAM: stream
  const stream = ref<StreamValue>(
    (route.query.stream?.toString() ?? '') as StreamValue
  )
  watch(stream, (newStream) => updateUrlParams({ stream: newStream }))

  // PARAM: area
  const area = ref<AreaValue>((route.query.area?.toString() ?? '') as AreaValue)
  watch(area, (newArea) => updateUrlParams({ area: newArea }))

  // PARAM: working group
  const workingGroup = ref<WorkingGroupValue>(
    (route.query.workinggroup?.toString() ?? '') as WorkingGroupValue
  )
  watch(workingGroup, (newWorkingGroup) =>
    updateUrlParams({ workinggroup: newWorkingGroup })
  )

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

  const hasFilters = !!(
    statuses.value.length > 0 ||
    publicationDateFrom.value ||
    publicationDateTo.value ||
    stream.value !== '' ||
    area.value !== '' ||
    workingGroup.value !== ''
  )

  return {
    q,
    statuses,
    toggleStatus,
    publicationDateFrom,
    publicationDateTo,
    stream,
    area,
    workingGroup,
    orderBy,
    searchResults,
    hasFilters
  }
})

/**
 * Stringifies dates to YYYY-M
 * January = 1 (not 0)
 */
export function formatDateString(year: number, month: number): string {
  return `${year}-${month}`
}

export function stringifyDate(date: Date | undefined): string {
  if (!date) {
    return ''
  }

  return formatDateString(date.getFullYear(), date.getMonth() + 1)
}

export function parseDateString(date: string): Date {
  const [year, month] = date.split('-').map((val) => parseFloat(val))
  const newDate = new Date(year, month - 1)
  return newDate
}

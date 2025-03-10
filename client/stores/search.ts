import { debounce } from 'lodash-es'
import type { SearchSchemaType, ResponseType } from '../server/api/search'
import { SEARCH_PATH, SEARCH_API_PATH } from '~/utilities/url'

export const Statuses = {
  any: 'Any',
  informational: 'Informational',
  standard: 'Standards Track',
  experimental: 'Experimental',
  bcp: 'Best Current Practice',
  historic: 'Historic',
  unknown: 'Unknown'
} as const

export type StatusValue = keyof typeof Statuses

export const Streams = {
  '': 'Any',
  ietf: 'IETF (Internet Engineering Task Force',
  ise: 'Independent Submission',
  irtf: 'Internet Research Task Force',
  iab: 'Internet Architecture Board',
  editorial: 'Editorial',
  legacy: 'Legacy'
} as const
export type StreamValue = keyof typeof Streams

export const Areas = {
  '': 'Any',
  int: 'Internet Area',
  ops: 'Operations and Management Area',
  rtg: 'Routing Area',
  sec: 'Security Area',
  wit: 'Web and Internet Transport Area',
  app: 'Applications Area',
  gen: 'General Area',
  art: 'Applications and Real-Time Area',
  rai: 'Real-time Applications and Infrastructure Area',
  irtf: 'IRTF Area',
  ietf: 'IETF Area',
  tsv: 'Transport Area'
} as const
export type AreaValue = keyof typeof Areas

export const WorkingGroups = {
  '': 'Any',
  '6man': 'IPv6 Maintenance',
  ippm: 'IP Performance Measurement',
  lsr: 'Link State Routing',
  cose: 'CBOR Object Signing and Encryption',
  none: 'Individual Submissions',
  lamps: 'Limited Additional Mechanisms for PKIX and SMIME',
  avtcore: 'Audio/Video Transport Core Maintenance',
  sidrops: 'SIDR Operations',
  cdni: 'Content Delivery Networks Interconnection',
  extra: 'Email mailstore and eXtensions To Revise or Amend',
  bpf: 'BPF/eBPF',
  v6ops: 'IPv6 Operations',
  uta: 'Using TLS in Applications',
  jmap: 'JSON Mail Access Protocol',
  dnsop: 'Domain Name System Operations',
  httpbis: 'HTTP',
  mpls: 'Multiprotocol Label Switching',
  tvr: 'Time-Variant Routing',
  ccamp: 'Common Control and Measurement Plane',
  tsvwg: 'Transport and Services Working Group',
  httpapi: 'Building Blocks for HTTP APIs',
  tcpm: 'TCP Maintenance and Minor Extensions',
  babel: 'Babel routing protocol',
  netconf: 'Network Configuration',
  nvo3: 'Network Virtualization Overlays',
  gnap: 'Grant Negotiation and Authorization Protocol',
  detnet: 'Deterministic Networking',
  opsawg: 'Operations and Management Area Working Group',
  mboned: 'MBONE Deployment',
  bess: 'BGP Enabled ServiceS',
  bier: 'Bit Indexed Explicit Replication',
  hrpc: 'Human Rights Protocol Considerations',
  iab: 'Internet Architecture Board',
  ipsecme: 'IP Security Maintenance and Extensions',
  add: 'Adaptive DNS Discovery',
  sframe: 'Secure Media Frames',
  pce: 'Path Computation Element',
  trill: 'Transparent Interconnection of Lots of Links',
  core: 'Constrained RESTful Environments',
  ace: 'Authentication and Authorization for Constrained Environments',
  cfrg: 'Crypto Forum',
  kitten: 'Common Authentication Technology Next Generation',
  qirg: 'Quantum Internet Research Group',
  cbor: 'Concise Binary Object Representation Maintenance and Extensions',
  openpgp: 'Open Specification for Pretty Good Privacy',
  privacypass: 'Privacy Pass',
  drip: 'Drone Remote ID Protocol',
  alto: 'Application-Layer Traffic Optimization',
  rtgwg: 'Routing Area Working Group',
  uuidrev: 'Revise Universally Unique Identifier Definitions',
  nfsv4: 'Network File System Version 4',
  regext: 'Registration Protocols Extensions',
  cellar: 'Codec Encoding for LossLess Archiving and Realtime transmission',
  sedate: 'Serialising Extended Data About Times and Events',
  t2trg: 'Thing-to-Thing',
  calext: 'Calendaring Extensions',
  idr: 'Inter-Domain Routing',
  spring: 'Source Packet Routing in Networking',
  teas: 'Traffic Engineering Architecture and Signaling',
  intarea: 'Internet Area Working Group',
  ohai: 'Oblivious HTTP Application Intermediation',
  dprive: 'DNS PRIVate Exchange'
} as const
export type WorkingGroupValue = keyof typeof WorkingGroups

export const OrderBy = {
  lowest: 'RFC no. (Lowest first)',
  highest: 'RFC no. (Highest first)'
} as const
export type OrderByValue = keyof typeof OrderBy

export type SearchParams = {
  q: string
  from: string
  to: string
  statuses: string
  stream: string
  area: string
  workinggroup: string
  order: string
  offset: string
}

type SearchResponse = null | ResponseType

type SearchNuxtError = {
  statusCode: number
  statusMessage: string
  message: string
  stack: string
  url: string
}

const THROTTLE_FETCH_SIGNAL_CANCEL = 'THROTTLE_FETCH_SIGNAL_CANCEL'
const THROTTLE_MS = 200
export const DEFAULT_LIMIT = 10 // we don't allow the user to directly control the limit just the offset

export const useSearchStore = defineStore('search', () => {
  const router = useRouter()
  const route = useRoute()

  /**
   * Updates router query params with current search config
   * and ensures empty values ie '' have that param removed from URL
   */
  function updateUrlParams(searchParams: Partial<SearchParams>) {
    if (route.path !== SEARCH_PATH) {
      console.info('Not updating URL params on route ', {
        routePath: route.path,
        searchPAth: SEARCH_PATH
      })
      // Only sync url params on '/search/' route, not on homepage
      return
    }

    const filterEmpty = <T extends Partial<SearchParams>>(obj: T): T =>
      Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== '') {
          acc[key as keyof SearchParams] = value
        }
        return acc
      }, {} as T)

    const query = filterEmpty({
      ...route.query,
      ...searchParams
    })

    router.push({
      path: SEARCH_PATH, // necessary because otherwise the router will change the path to '/search' not '/search/'
      query
    })
  }

  // Search results
  const searchResponse = ref<SearchResponse>(null)
  const searchError = ref<string>()

  const allStatus = ref<unknown[]>([])

  // Debounced search API
  const searchSoon = (() => {
    let previousAbortController: AbortController | null = null

    return debounce(() => {
      if (previousAbortController) {
        previousAbortController.abort(THROTTLE_FETCH_SIGNAL_CANCEL)
      }
      previousAbortController = new AbortController()

      // while fetching hide current results
      searchResponse.value = null
      window.scrollTo(0, 0) // reset scroll to top of page

      const params = new URLSearchParams({
        q: q.value,
        from: stringifyDate(publicationDateFrom.value),
        to: stringifyDate(publicationDateTo.value),
        statuses: statuses.value.join(','),
        stream: stream.value,
        area: area.value,
        workinggroup: workingGroup.value,
        order: orderBy.value,
        offset: offset.value.toString()
      } satisfies SearchSchemaType)

      const paramsString = params.toString()

      // delete any previous error as we're doing a new search
      searchError.value = ''

      fetch(
        `${SEARCH_API_PATH}${paramsString.length > 0 ? `?${paramsString}` : ''}`,
        {
          signal: previousAbortController.signal
        }
      )
        .then((resp) => resp.json())
        .then((data: SearchResponse | SearchNuxtError) => {
          if (isSearchResponse(data)) {
            searchResponse.value = data
            if (data?.results) {
              data.results.forEach((result) => {
                if (result.status) {
                  allStatus.value.push(result.status)
                }
              })
            }
          } else if (isSearchNuxtError(data)) {
            searchError.value = `"${data.statusCode} ${data.message}"`
          } else {
            searchError.value = `${JSON.stringify(data)}`
          }
        })
        .catch((reason) => {
          if (reason === THROTTLE_FETCH_SIGNAL_CANCEL) {
            // this is a normal occurence when aborting a fetch via previousAbortController.signal
            // this is not an error so we ignore it
            return
          }
          searchError.value = reason.toString()
        })
    }, THROTTLE_MS)
  })()

  const resetOffsetDueToSearchChange = () => {
    offset.value = 0
  }

  // PARAM: Q (search terms string)
  const q = ref<string>(route.query.q?.toString() ?? '')
  watch(q, (newQ) => {
    resetOffsetDueToSearchChange()
    updateUrlParams({ q: newQ })
    searchSoon()
  })

  // PARAM: publicationDateFrom
  const publicationDateFrom = ref<Date | undefined>(
    route.query.from ?
      new Date(parseDateString(route.query.from.toString()))
    : undefined
  )
  watch(publicationDateFrom, (newFrom) => {
    console.log({ newFrom })
    resetOffsetDueToSearchChange()
    updateUrlParams({ from: stringifyDate(newFrom) })
    searchSoon()
  })

  // PARAM: publicationDateTo
  const publicationDateTo = ref<Date | undefined>(
    route.query.to ?
      new Date(parseDateString(route.query.to.toString()))
    : undefined
  )
  watch(publicationDateTo, (newTo) => {
    resetOffsetDueToSearchChange()
    updateUrlParams({ to: stringifyDate(newTo) })
    searchSoon()
  })

  // PARAM: stream
  const stream = ref<StreamValue>(
    (route.query.stream?.toString() ?? '') as StreamValue
  )
  watch(stream, (newStream) => {
    resetOffsetDueToSearchChange()
    updateUrlParams({ stream: newStream })
    searchSoon()
  })

  // PARAM: area
  const area = ref<AreaValue>((route.query.area?.toString() ?? '') as AreaValue)
  watch(area, (newArea) => {
    resetOffsetDueToSearchChange()
    updateUrlParams({ area: newArea })
    searchSoon()
  })

  // PARAM: working group
  const workingGroup = ref<WorkingGroupValue>(
    (route.query.workinggroup?.toString() ?? '') as WorkingGroupValue
  )
  watch(workingGroup, (newWorkingGroup) => {
    resetOffsetDueToSearchChange()
    updateUrlParams({ workinggroup: newWorkingGroup })
    searchSoon()
  })

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
      resetOffsetDueToSearchChange()
      updateUrlParams({
        statuses: statuses.length > 0 ? statuses.join(',') : ''
      })
      searchSoon()
    },
    {
      deep: true // because we're mutating array we need to 'deep'ly watch the array to see value changes
    }
  )

  // PARAM: order by
  const orderBy = ref<OrderByValue>(
    (route.query.order?.toString() ?? 'highest') as OrderByValue
  )
  watch(orderBy, (newOrder) => {
    resetOffsetDueToSearchChange()
    updateUrlParams({ order: newOrder !== 'lowest' ? '' : newOrder })
    searchSoon()
  })

  // PARAM: offset
  const offset = ref<number>(
    route.query.offset ? parseInt(route.query.offset.toString(), 10) : 0
  )
  watch(offset, (newOffset) => {
    updateUrlParams({ offset: newOffset !== 0 ? newOffset.toString() : '' })
    searchSoon()
  })

  function clearFilters() {
    q.value = ''
    while (statuses.value.length) {
      // mutating the array, see comment on toggleStatus()
      statuses.value.pop()
    }
    publicationDateFrom.value = undefined
    publicationDateTo.value = undefined
    stream.value = ''
    area.value = ''
    workingGroup.value = ''
    orderBy.value = 'highest'
    searchResponse.value = null
    offset.value = 0
    searchError.value = ''
    searchSoon()
  }

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
    offset,
    hasFilters,
    clearFilters,
    allStatus,

    searchResponse,
    searchError
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

function isSearchResponse(data: unknown): data is SearchResponse {
  return (
    typeof data === 'object' &&
    Object.prototype.hasOwnProperty.call(data, 'count') &&
    Object.prototype.hasOwnProperty.call(data, 'next') &&
    Object.prototype.hasOwnProperty.call(data, 'previous') &&
    Object.prototype.hasOwnProperty.call(data, 'results')
  )
}

function isSearchNuxtError(data: unknown): data is SearchNuxtError {
  return (
    typeof data === 'object' &&
    Object.prototype.hasOwnProperty.call(data, 'statusCode') &&
    Object.prototype.hasOwnProperty.call(data, 'message')
  )
}

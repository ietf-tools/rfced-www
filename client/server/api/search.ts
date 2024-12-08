import { z } from 'zod'
// import { RedApi } from '../../generated/red/index'
// import type { PaginatedRfcMetadataList } from '../../generated/red/index'
import { ApiClient } from '../../generated/red-client'
import type {
  PaginatedRfcMetadataList,
  SlugEnum
} from '../../generated/red-client'

const SearchParamsSchema = z.object({
  q: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  statuses: z.string().optional(),
  stream: z.string().optional(),
  area: z.string().optional(),
  workinggroup: z.string().optional(),
  order: z.enum(['lowest', 'highest']).optional(),
  offset: z.string().optional()
})

export type SearchSchemaType = z.infer<typeof SearchParamsSchema>

export type ResponseType = PaginatedRfcMetadataList

export default defineEventHandler(async (event): Promise<ResponseType> => {
  const query = await getValidatedQuery(event, (body) =>
    SearchParamsSchema.safeParse(body)
  )

  if (query.error) {
    throw createError({
      statusCode: 400,
      statusMessage: JSON.stringify(query.error)
    })
  }

  const [published_after, published_before] = parseOptionalDateRange(
    query.data.from,
    query.data.to
  )

  const redApi = new ApiClient({ baseUrl: 'http://localhost:8000/' })
  type DocListArg = Parameters<(typeof redApi)['red']['docList']>[0]

  const docListArg: DocListArg = {}

  if (published_after) {
    docListArg.published_after = published_after
  }
  if (published_before) {
    docListArg.published_before = published_before
  }
  if (query.data.q) {
    docListArg.search = query.data.q
  }
  if (query.data.order) {
    docListArg.sort = [query.data.order === 'highest' ? '-number' : 'number']
  }
  if (query.data.offset) {
    docListArg.offset = parseInt(query.data.offset, 10)
  }
  if (query.data.stream) {
    docListArg.stream = [query.data.stream]
  }
  if (query.data.area) {
    docListArg.area = [query.data.area]
  }
  if (query.data.workinggroup) {
    docListArg.group = [query.data.workinggroup]
  }
  if (query.data.statuses) {
    docListArg.status = query.data.statuses.split(',') as SlugEnum[]
  }

  const results = await redApi.red.docList(docListArg)

  return results
})

function parseOptionalDateRange(
  optionalDate1: string | undefined,
  optionalDate2: string | undefined
): [undefined, undefined] | [string, string] {
  if (!optionalDate1 && !optionalDate2) return [undefined, undefined]

  // then one or two dates are not undefined
  let date1 = new Date()
  let date2 = new Date()
  try {
    if (optionalDate1) {
      date1 = new Date(optionalDate1)
    }
    if (optionalDate2) {
      date2 = new Date(optionalDate2)
    }
  } catch (e: unknown) {
    console.error(
      'Ignoring date range as unable to parse date1 or date2',
      { optionalDate1, optionalDate2 },
      e
    )
    return [undefined, undefined]
  }

  const startDate = date1 < date2 ? date1 : date2
  let endDate = date1 > date2 ? date2 : date1

  // ensure endDate's day of the month is set to the last day of the month
  // so that the YYYY-MM is inclusive of dates within the month
  // https://stackoverflow.com/a/13773408
  endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0)

  const lengthOfOpenAPIDate = 'YYYY-MM-DD'.length

  return [
    // truncate ISO date string to exclude time portion
    startDate.toISOString().substring(0, lengthOfOpenAPIDate),
    endDate.toISOString().substring(0, lengthOfOpenAPIDate)
  ]
}

import { z } from 'zod'
import { ApiClient } from '../../generated/red-client'
import type {
  PaginatedRfcMetadataList,
  SlugEnum
} from '../../generated/red-client'
import { PRIVATE_API_URL } from '../../utilities/url'

export const SearchParamsSchema = z.object({
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

  const redApi = new ApiClient({ baseUrl: PRIVATE_API_URL })
  type DocListArg = Parameters<(typeof redApi)['red']['docList']>[0]

  const docListArg: DocListArg = {}

  docListArg.limit = 10 // stop users from requesting too much at a time

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
  fromDateParam: string | undefined,
  toDateParam: string | undefined
): [undefined, undefined] | [string, string] {
  if (!fromDateParam && !toDateParam) return [undefined, undefined]

  // then one or two dates are not undefined
  let fromDate = new Date('1970-1-1') // default value before first RFC
  let toDate = new Date() // default value Now
  try {
    if (fromDateParam) {
      fromDate = new Date(fromDateParam)
    }
    if (toDateParam) {
      toDate = new Date(toDateParam)
    }
  } catch (e: unknown) {
    console.error(
      'Ignoring date range as unable to parse date1 or date2',
      { optionalDate1: fromDateParam, optionalDate2: toDateParam },
      e
    )
    return [undefined, undefined]
  }

  const isFromBeforeTo = fromDate.getTime() < toDate.getTime()

  const startDate = isFromBeforeTo ? fromDate : toDate
  let endDate = isFromBeforeTo ? toDate : fromDate

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

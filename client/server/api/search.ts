import { z } from 'zod'
import { RedApi } from '../../generated/datatracker_client/index'

const SearchSchema = z.object({
  q: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  statuses: z.string().optional(),
  stream: z.string().optional(),
  area: z.string().optional(),
  workinggroup: z.string().optional(),
  order: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, (body) =>
    SearchSchema.safeParse(body)
  )

  if (query.error) {
    throw createError({
      statusCode: 400,
      statusMessage: JSON.stringify(query.error)
    })
  }

  const publishedBefore = parseOptionalDate(query.data.from)
  const publishedAfter = parseOptionalDate(query.data.to)

  const api = new RedApi()

  const results = api.redDocList({ publishedBefore, publishedAfter })

  return {
    list: results
  }
})

function parseOptionalDate(optionalDate: string | undefined): Date | undefined {
  if (!optionalDate) return
  return new Date(optionalDate)
}

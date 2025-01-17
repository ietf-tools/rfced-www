import { z } from 'zod'
import { ApiClient } from '~/generated/red-client'
import { PRIVATE_API_URL } from '~/utilities/url'
import { renderRfcIndexDotTxt } from '~/utilities/rfc-index-txt'

type RFC_INDEX_DATA_STORAGE = string
type RFC_INDEX_METADATA_STORAGE = { timestamp_ms: number }

const CACHE_AGE_EXPIRY_MS = 24 * 60 * 60 * 1000
const DELAY_BETWEEN_REQUESTS_MS = 50
const STORAGE_GROUP = 'rfc-index'
const STORAGE_TXT_KEY = 'txt'
const STORAGE_METADATA_KEY = 'txt.json'
const CLEAN_PARAM = 'clean'
const CLEAN_ALLOWED = 'clean' // FIXME: limit cleaning by env var password?

export const ParamsSchema = z.object({
  [CLEAN_PARAM]: z.enum([CLEAN_ALLOWED]).optional()
})

export default defineEventHandler(async (event) => {
  const CACHE_AGE_EXPIRY_SECONDS = CACHE_AGE_EXPIRY_MS / 1000
  setResponseHeaders(event, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': `max-age=${CACHE_AGE_EXPIRY_SECONDS} Public`
  })

  const query = await getValidatedQuery(event, (body) =>
    ParamsSchema.safeParse(body)
  )

  if (query.error) {
    throw createError({
      statusCode: 400,
      statusMessage: JSON.stringify(query.error)
    })
  }

  if (query.data.clean === CLEAN_ALLOWED) {
    console.log('Cleaning cache...')
    await Promise.all([
      useStorage<RFC_INDEX_METADATA_STORAGE>(STORAGE_GROUP).clear(
        STORAGE_METADATA_KEY
      ),
      useStorage<RFC_INDEX_DATA_STORAGE>(STORAGE_GROUP).clear(STORAGE_TXT_KEY)
    ])
  }

  const metadata =
    await useStorage<RFC_INDEX_METADATA_STORAGE>(STORAGE_GROUP).getItem(
      STORAGE_METADATA_KEY
    )

  const relativeCacheExpiry = Date.now() - CACHE_AGE_EXPIRY_MS

  if (metadata && metadata.timestamp_ms > relativeCacheExpiry) {
    console.log(
      `Serving from cache (cache timestamp ${metadata.timestamp_ms}ms > expiry ${relativeCacheExpiry}ms)`
    )
    const txt =
      await useStorage<RFC_INDEX_DATA_STORAGE>(STORAGE_GROUP).getItem(
        STORAGE_TXT_KEY
      )

    if (txt) {
      return txt
    }

    // this shouldn't occur because metadata and data should both be set, and it is recoverable
    // because if there's no txt we can just generate it which is what the following code does.
    // this is probably an unusual race condition if another thread clears the cache between the
    // multiple awaits.
    console.log('Unusual race condition in cache usage')
  }

  const abortController = new AbortController()

  const stream = new ReadableStream({
    start(controller) {
      const cacheValueArray: string[] = []

      const push = (data: string): void => {
        if (abortController.signal.aborted) {
          // ignore
          return
        }
        cacheValueArray.push(data)
        controller.enqueue(data)
      }
      const close = async () => {
        abortController.abort()
        await Promise.all([
          useStorage<RFC_INDEX_METADATA_STORAGE>(STORAGE_GROUP).setItem(
            STORAGE_METADATA_KEY,
            {
              timestamp_ms: Date.now()
            }
          ),
          useStorage<RFC_INDEX_DATA_STORAGE>(STORAGE_GROUP).setItem(
            STORAGE_TXT_KEY,
            cacheValueArray.join('')
          )
        ])
        controller.close()
      }

      const redApi = new ApiClient({ baseUrl: PRIVATE_API_URL })

      // this is a promise but we don't care about waiting for the result
      void renderRfcIndexDotTxt(
        push,
        close,
        abortController,
        redApi,
        DELAY_BETWEEN_REQUESTS_MS
      )
    },
    // cleanup when the connection is terminated
    cancel() {
      console.log('closing stream...')
      abortController.abort()
    }
  })

  return sendStream(event, stream)
})

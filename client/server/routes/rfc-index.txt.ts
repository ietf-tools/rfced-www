import { ApiClient } from '~/generated/red-client'
import { PRIVATE_API_URL } from '~/utilities/url'
import { renderRfcIndexDotTxt } from '~/utilities/rfc-index-txt'

const DELAY_BETWEEN_REQUESTS_MS = 50

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Content-Type': 'text/plain; charset=utf-8'
  })

  const abortController = new AbortController()

  const stream = new ReadableStream({
    start(controller) {
      const push = (data: string): void => {
        if (abortController.signal.aborted) {
          // ignore
          return
        }
        controller.enqueue(data)
      }
      const close = () => {
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

import { renderRfcIndexDotTxt } from '~/utilities/rfc-index-txt'
import { getRedClient } from '~/utilities/redClientWrappers'

const DELAY_BETWEEN_REQUESTS_MS = 0

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Content-Type': 'text/plain; charset=utf-8'
  })

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
        controller.close()
      }

      const redApi = getRedClient()

      // this is a promise but we don't care about waiting for the result
      void renderRfcIndexDotTxt({
        push,
        close,
        abortController,
        redApi,
        delayBetweenRequestsMs: DELAY_BETWEEN_REQUESTS_MS
      })
    },
    // cleanup when the connection is terminated
    cancel() {
      console.log('closing stream...')
      abortController.abort()
    }
  })

  return sendStream(event, stream)
})

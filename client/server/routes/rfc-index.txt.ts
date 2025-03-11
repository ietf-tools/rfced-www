import { getHeader, renderRfcIndexDotTxt } from '~/utilities/rfc-index-txt'
import { getRedClient } from '~/utilities/redClientWrappers'

const DELAY_BETWEEN_REQUESTS_MS = 0

export default defineEventHandler(async (event) => {
  setResponseStatus(
    event,
    200 /**
     * note code comment on getHeader()
     * we need to optimistically return `HTTP 200` because in a streaming response
     * any errors occur after the HTTP code anyway
     */
  )

  setResponseHeaders(event, {
    'Content-Type': 'text/plain; charset=utf-8'
  })

  const abortController = new AbortController()

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(
        getHeader() // note code comment on `getHeader()` about why we need to immediately do this
      )

      const push = (data: string): void => {
        if (abortController.signal.aborted) {
          // ignore
          return
        }
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
        delayBetweenRequestsMs: DELAY_BETWEEN_REQUESTS_MS,
        doNotRenderHeader: true
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

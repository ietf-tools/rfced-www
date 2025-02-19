import { getRedClient } from '~/utilities/redClientWrappers'
import { renderRfcIndexDotXml } from '~/utilities/rfc-index-xml'

const DELAY_BETWEEN_REQUESTS_MS = 50

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Content-Type': 'text/xml; charset=utf-8'
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

      const redApi = getRedClient()

      // this is a promise but we don't care about waiting for the result
      void renderRfcIndexDotXml({
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

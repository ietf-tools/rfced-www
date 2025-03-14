import { renderRfcIndexDotXml } from '~/utilities/rfc-index-xml'
import { bufferStreamingResponse } from '~/utilities/stream'

const DELAY_BETWEEN_REQUESTS_MS = 50

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Content-Type': 'text/xml; charset=utf-8'
  })

  // This was a streaming response but due to Nuxt bugs <https://github.com/nuxt/nuxt/issues/30987>
  // we now collate/buffer the stream and just return a string.
  // If Nuxt fixes the bug we can switch back to streaming by using `getStreamingResponse` instead
  const txt = await bufferStreamingResponse(
    ({ push, close, abortController, redApi }) =>
      renderRfcIndexDotXml({
        push,
        close,
        abortController,
        redApi,
        delayBetweenRequestsMs: DELAY_BETWEEN_REQUESTS_MS
      })
  )

  return txt
})

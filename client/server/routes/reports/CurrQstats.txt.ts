import { ApiClient } from '~/generated/red-client'
import { PRIVATE_API_URL } from '~/utilities/url'
import { renderCurrQstatsDotTxt } from '~/utilities/CurrQstats-txt'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Content-Type': 'text/plain; charset=utf-8'
  })

  const redApi = new ApiClient({ baseUrl: PRIVATE_API_URL })
  const result = await renderCurrQstatsDotTxt({
    redApi
  })
  return result
})

import { renderCurrQstatsDotTxt } from '~/utilities/CurrQstats-txt'
import { getRedClient } from '~/utilities/redClientWrappers'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Content-Type': 'text/plain; charset=utf-8'
  })

  const redApi = getRedClient()
  const txt = await renderCurrQstatsDotTxt({
    redApi
  })
  return txt
})

import { refsRefTxtBuilder } from '~/utilities/url'
import { getRedClient } from '~/utilities/redClientWrappers'
import { refsRefRfcIdTxt } from '~/utilities/rfc'

const refRegex = /^ref([0-9]+)\.txt$/

export default defineEventHandler(async (event) => {
  const { params } = event.context
  if (!params) {
    throw Error('Expected params')
  }
  const { rfcId } = params
  const rfcPatterns = rfcId.match(refRegex)
  if (!rfcPatterns) {
    throw Error(`Expected param to match ${rfcId}`)
  }
  const rfcNumberMatch = rfcPatterns[1] // eg '0001'
  const rfcNumber = parseInt(rfcNumberMatch, 10)
  const withoutLeadingZeroes = rfcNumber.toString()
  // if the rfcNumber has leading zeroes this will fail
  if (withoutLeadingZeroes !== rfcNumberMatch) {
    sendRedirect(event, refsRefTxtBuilder(rfcId), 301)
    return
  }

  const redApi = getRedClient()

  const rfc = await redApi.red.docRetrieve(rfcNumber)

  // FIXME: test for RFC 14
  if (!rfc) {
    throw createError({
      statusCode: 404,
      message: 'not found',
      fatal: true
    })
  }

  setResponseHeaders(event, {
    'Content-Type': 'text/plain; charset=utf-8'
  })

  return refsRefRfcIdTxt(rfc)
})

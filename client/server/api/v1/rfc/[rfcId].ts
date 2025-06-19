import { docRetrieve, getRedClient } from '~/utilities/redClientWrappers'
import { rfcToRfcJSON } from '~/utilities/rfc-converters'
import { FIXME_getRFCWithMissingData } from '~/utilities/rfc.mocks'
import { rfcJSONPathBuilder } from '~/utilities/url'

const rfcRegex = /^rfc([0-9]+)\.json$/

export default defineEventHandler(async (event) => {
  const { params } = event.context
  if (!params) {
    throw Error('Expected params')
  }
  const { rfcId } = params
  const rfcPatterns = rfcId.match(rfcRegex)
  if (!rfcPatterns) {
    throw Error(
      `Expected valid URL where the last part matches rfcN.json (N is a number)`
    )
  }
  const rfcNumberMatch = rfcPatterns[1] // eg '0001'
  const rfcNumber = parseInt(rfcNumberMatch, 10)
  const withoutLeadingZeroes = rfcNumber.toString()
  // if the rfcNumber has leading zeroes this will be false
  if (withoutLeadingZeroes !== rfcNumberMatch) {
    return sendRedirect(event, rfcJSONPathBuilder(rfcId), 301)
  }

  const redApi = getRedClient()

  const rfc = await docRetrieve(redApi, rfcNumber)

  if (!rfc) {
    throw createError({
      statusCode: 404,
      message: 'not found',
      fatal: true
    })
  }

  const rfcWithMissingData = FIXME_getRFCWithMissingData(rfc)

  const rfcJson = rfcToRfcJSON(rfcWithMissingData)

  return rfcJson
})

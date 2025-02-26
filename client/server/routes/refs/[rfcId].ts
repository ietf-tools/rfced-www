import { refsRefTxtPathBuilder } from '~/utilities/url'
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
    sendRedirect(event, refsRefTxtPathBuilder(rfcId), 301)
    return
  }

  const redApi = getRedClient()

  /** Safety wrapper around docRetrieve access to catch errors  */
  const docRetrieve = async (rfcNumber: number) => {
    try {
      return await redApi.red.docRetrieve(rfcNumber)
    } catch (e: unknown) {
      // The API can throw to express 404s
      if (
        e &&
        typeof e === 'object' &&
        'type' in e &&
        e.type === 'client_error' &&
        'errors' in e &&
        Array.isArray(e.errors) &&
        e.errors.length > 0
      ) {
        const error = e.errors[0]
        if ('code' in error && error.code === 'not_found') {
          return null
        }
      }

      console.error(e)
      throw createError({
        statusCode: 500,
        message: 'Unhandled Red API response',
        fatal: true
      })
    }
  }

  const rfc = await docRetrieve(rfcNumber)

  if (!rfc) {
    // If an RFC isn't available it might be Not Issued
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

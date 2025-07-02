import { FIXME_getRFCMetadataWithMissingData } from './rfc.mocks'
import { setTimeoutPromise } from './promises'
import { isProdApi } from './url'
import { ApiClient } from '~/generated/red-client'

export const getRedClient = () => {
  const isServer = import.meta.server
  const isTest = import.meta.env.VITEST

  const config = useRuntimeConfig()
  const headers: ApiClient['Config']['headers'] = {}
  const {
    cfServiceTokenId,
    cfServiceTokenSecret,
    public: { datatrackerBase }
  } = config

  if (cfServiceTokenId && typeof cfServiceTokenId === 'string') {
    headers['CF-Access-Client-Id'] = cfServiceTokenId
  }
  if (cfServiceTokenSecret && typeof cfServiceTokenSecret === 'string') {
    headers['CF-Access-Client-Secret'] = cfServiceTokenSecret
  }
  if (typeof datatrackerBase !== 'string') {
    throw Error(
      `Required nuxt.config.ts runtimeConfig.public.datatrackerBase not found (or not a string). Was typeof=${typeof datatrackerBase}. isServer=${isServer}. isTest=${isTest}`
    )
  }

  if (
    isProdApi(datatrackerBase) &&
    (!cfServiceTokenId ||
      typeof cfServiceTokenId !== 'string' ||
      !cfServiceTokenSecret ||
      typeof cfServiceTokenSecret !== 'string')
  ) {
    throw Error(
      `Detected ${datatrackerBase} as prod API but required headers cfServiceTokenId=${typeof cfServiceTokenId} or cfServiceTokenSecret=${typeof cfServiceTokenSecret} were missing. isServer=${isServer}. isTest=${isTest}`
    )
  }

  if (!isServer && !isTest) {
    throw Error(
      `redClientWrapper should only be called serverside or in a test runner. Was isServer=${isServer}. isTest=${isTest}`
    )
  }

  return new ApiClient({
    baseUrl: datatrackerBase,
    headers
  })
}

type DocListArg = Parameters<ApiClient['red']['docList']>[0]

type Props = {
  apiClient: ApiClient
  sort: 'ascending' | 'descending'
  rfcNumberLimit?: number
  delayBetweenRequestsMs?: number
}

const FIRST_RFC_NUMBER = 1
const DEFAULT_DELAY_BETWEEN_REQUESTS = 50
const MAX_LIMIT_PER_REQUEST = 1000

export const getRFCs = async ({
  apiClient,
  sort,
  rfcNumberLimit,
  delayBetweenRequestsMs: customDelayBetweenRequests
}: Props) => {
  const abortController = new AbortController()
  const delayBetweenRequestsMs =
    customDelayBetweenRequests ?? DEFAULT_DELAY_BETWEEN_REQUESTS
  const rfcs: ReturnType<typeof FIXME_getRFCMetadataWithMissingData>[] = []

  const getLargestRfcNumber = async (): Promise<number> => {
    const docListArg: DocListArg = {}
    docListArg.sort = ['-number'] // sort by oldest RFC to find the end
    docListArg.limit = 1 // we only need one result
    const response = await apiClient.red.docList(docListArg)
    const largestRfcNumber = response.results[0].number
    return largestRfcNumber
  }

  const getEndOfResults = async (): Promise<number> => {
    if (sort === 'ascending') {
      if (rfcNumberLimit === undefined) {
        return getLargestRfcNumber()
      }
      return rfcNumberLimit
    }
    // sort is descending
    if (rfcNumberLimit !== undefined) {
      const largestRfcNumber = await getLargestRfcNumber()
      return Math.max(largestRfcNumber - rfcNumberLimit, FIRST_RFC_NUMBER)
    }
    return FIRST_RFC_NUMBER
  }

  const endOfResultsRfcNumber = await getEndOfResults()

  const docListArg: DocListArg = {}
  docListArg.sort = [sort === 'ascending' ? 'number' : '-number']
  let offset = 0 // offset is API database row offset which is not an RFC number offset

  while (!abortController.signal.aborted) {
    docListArg.offset = offset
    docListArg.limit = Math.min(
      rfcNumberLimit !== undefined ? rfcNumberLimit : Infinity,
      MAX_LIMIT_PER_REQUEST
    ) // as an API optimisation use rfcNumberLimit if not greater than MAX_LIMIT_PER_REQUEST

    const response = await apiClient.red.docList(docListArg)

    const existingRfcNumbers = rfcs.map((rfcMetadata) => rfcMetadata.number)

    rfcs.push(
      ...response.results
        .filter((rfcMetadata) => {
          // if there's an rfcNumberLimit use it to discard extra results
          if (rfcNumberLimit === undefined) {
            return true
          }
          if (sort === 'ascending') {
            return rfcMetadata.number <= endOfResultsRfcNumber
          }
          return rfcMetadata.number >= endOfResultsRfcNumber
        })
        .filter(
          (rfcMetadata) =>
            // the API's database could change during pagination and return the same result
            // so we should ensure we don't already have the RFC (by number)
            !existingRfcNumbers.includes(rfcMetadata.number)
        )
        .map((rfcMetadata) => FIXME_getRFCMetadataWithMissingData(rfcMetadata))
    )

    if (
      // if we got no results then stop
      response.results.length === 0 ||
      // we got some of same results twice while paginating so stop
      response.results.some((rfcMetadata) =>
        existingRfcNumbers.includes(rfcMetadata.number)
      )
    ) {
      break
    }

    if (
      rfcNumberLimit !== undefined ?
        response.results.some((rfcMetadata) =>
          sort === 'ascending' ?
            // some RFC numbers may be missing (ie Not Issued) so it's possible for
            // endOfResultsRfcNumber to not be in the results, that's why we check for numbers
            // beyond the endOfResultsRfcNumber too to know when we've passed it.
            //
            // There's a bug here if the endOfResultsRfcNumber isn't in the results AND if
            // there were no results beyond that. E.g. a rfcNumberLimit of 99999999 will never
            // be found
            rfcMetadata.number >= endOfResultsRfcNumber
          : rfcMetadata.number <= endOfResultsRfcNumber
        )
      : response.results.some(
          (rfcMetadata) => rfcMetadata.number === endOfResultsRfcNumber
        )
    ) {
      // we're at the end
      break
    }

    if (delayBetweenRequestsMs > 0) {
      await setTimeoutPromise(delayBetweenRequestsMs)
    }

    offset += response.results.length
  }

  return rfcs
}

/** Safety wrapper around docRetrieve access to catch errors  */
export const docRetrieve = async (redApi: ApiClient, rfcNumber: number) => {
  try {
    return await redApi.red.docRetrieve(rfcNumber)
  } catch (e: unknown) {
    // The API client can throw to express 404s... if so, return null
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

    const errorMessage = 'Unhandled Red API response'
    console.error(errorMessage, e)
    throw Error(`${errorMessage}. See console`)
  }
}

import { getRFCWithExtraFields } from './rfc.mocks'
import { setTimeoutPromise } from './promises'
import type { ApiClient } from '~/generated/red-client'

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
  const rfcs: ReturnType<typeof getRFCWithExtraFields>[] = []

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

    // For debugging...
    // const collectedRfcNumbers = rfcs.map((rfcMetadata) => rfcMetadata.number)
    // console.log(
    //   'Making API request...',
    //   docListArg.sort,
    //   docListArg.limit,
    //   `(ending on ${endOfResultsRfcNumber})`,
    //   Math.min(...collectedRfcNumbers),
    //   Math.max(...collectedRfcNumbers)
    // )
    const response = await apiClient.red.docList(docListArg)

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
        .map((rfcMetadata) => getRFCWithExtraFields(rfcMetadata))
    )

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

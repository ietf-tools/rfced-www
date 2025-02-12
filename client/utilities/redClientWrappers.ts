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

  const endOfResultsRfcNumber =
    sort === 'ascending' ? await getLargestRfcNumber() : FIRST_RFC_NUMBER

  const docListArg: DocListArg = {}
  docListArg.sort = [sort === 'ascending' ? 'number' : '-number']
  let offset = 0 // offset is API database row offset which is not an RFC number offset

  while (!abortController.signal.aborted) {
    docListArg.offset = offset
    docListArg.limit = Math.min(
      //      rfcNumberLimit !== undefined ? rfcNumberLimit : Infinity,
      MAX_LIMIT_PER_REQUEST
    ) // as an API optimisation use rfcNumberLimit if not greater than MAX_LIMIT_PER_REQUEST

    const response = await apiClient.red.docList(docListArg)

    rfcs.push(
      ...response.results
        .filter((rfcMetadata) =>
          // if there's an rfcLimit use it to discard extra results
          rfcNumberLimit !== undefined ?
            rfcMetadata.number <= rfcNumberLimit
          : true
        )
        .map((rfcMetadata) => getRFCWithExtraFields(rfcMetadata))
    )

    if (
      rfcNumberLimit !== undefined ?
        response.results.some((rfcMetadata) =>
          sort === 'ascending' ?
            rfcMetadata.number > rfcNumberLimit
          : rfcMetadata.number < rfcNumberLimit
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

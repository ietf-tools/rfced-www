import { getRFCWithExtraFields } from './rfc.mocks'
import { setTimeoutPromise } from './promises'
import type { ApiClient } from '~/generated/red-client'

type DocListArg = Parameters<ApiClient['red']['docList']>[0]

export const getAllRFCs = async (apiClient: ApiClient) => {
  const abortController = new AbortController()
  const delayBetweenRequestsMs = 50
  const rfcs: ReturnType<typeof getRFCWithExtraFields>[] = []

  const docListArg: DocListArg = {}
  docListArg.sort = ['-number'] // sort by oldest RFC to find the end
  docListArg.limit = 1 // we only need one result
  const response = await apiClient.red.docList(docListArg)
  const largestRfcNumber = response.results[0].number

  docListArg.sort = ['number'] // sort by first RFC
  let offset = 0

  while (!abortController.signal.aborted) {
    docListArg.offset = offset
    docListArg.limit = 1000

    const response = await apiClient.red.docList(docListArg)
    offset += response.results.length

    rfcs.push(
      ...response.results.map((rfcMetadata) =>
        getRFCWithExtraFields(rfcMetadata)
      )
    )

    if (
      response.results.some(
        (rfcMetadata) => rfcMetadata.number === largestRfcNumber
      )
    ) {
      // we're at the end
      break
    }

    if (delayBetweenRequestsMs > 0) {
      await setTimeoutPromise(delayBetweenRequestsMs)
    }
  }

  return rfcs
}

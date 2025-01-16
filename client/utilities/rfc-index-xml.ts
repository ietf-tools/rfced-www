import { delay, padStart } from 'lodash-es'
import type { ApiClient, RfcMetadata } from '~/generated/red-client'

type DocListArg = Parameters<ApiClient['red']['docList']>[0]

export async function renderRfcIndexDotXml(
  push: (data: string) => void,
  close: () => void,
  abortController: AbortController,
  redApi: ApiClient,
  delayBetweenRequestsMs: number
) {
  push('<?xml version="1.0" encoding="UTF-8"?>\n')
  push(
    '<rfc-index xmlns="https://www.rfc-editor.org/rfc-index" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="https://www.rfc-editor.org/rfc-index https://www.rfc-editor.org/rfc-index.xsd">\n'
  )
  const docListArg: DocListArg = {}
  docListArg.sort = ['-number'] // sort by first RFC
  docListArg.limit = 1 // we only need one result
  const response = await redApi.red.docList(docListArg)
  const largestRfcNumber = response.results[0].number
  const longestRfcNumberLength = largestRfcNumber.toString().length

  docListArg.sort = ['number'] // sort by first RFC
  let offset = 0

  while (!abortController.signal.aborted) {
    docListArg.offset = offset
    docListArg.limit = 1000

    const response = await redApi.red.docList(docListArg)

    response.results.forEach((rfcMetadata) => {
      push(
        `<bcp-entry><doc-id>BCP${padNumber(rfcMetadata.number, longestRfcNumberLength)}</doc-id>`
      )

      // if (rfcMetadata.formats && rfc.formats.length > 0) {
      //   rfc.formats.map((format) => format.type).join(', ')}`
      // }

      //if (rfcMetadata.obsoletes && rfcMetadata.obsoletes.length > 0) {
      // obsups += ` (Obsoletes ${rfcMetadata.obsoletes
      //   .map((item) => formatRfcNumber(item.number, layout))
      //   .join(', ')})`
      //}

      //if (rfcMetadata.obsoleted_by && rfcMetadata.obsoleted_by.length > 0) {
      // obsups += ` (Obsoleted by ${rfc.obsoleted_by
      //   .map((item) => formatRfcNumber(item.number, layout))
      //   .join(', ')})`
      // }
      //if (rfcMetadata.updates && rfcMetadata.updates.length > 0) {
      // obsups += ` (Updates ${rfc.updates
      //   .map((item) => formatRfcNumber(item.number, layout))
      //   .join(', ')})`
      //}
      //if (rfcMetadata.updated_by && rfcMetadata.updated_by.length > 0) {
      // obsups += ` (Updated by ${rfc.updated_by
      //   .map((item) => formatRfcNumber(item.number, layout))
      //   .join(', ')})`
      //}

      //if(rfcMetadata.is_also && rfcMetadata.is_also.length > 0) {
      //
      // }

      // if (rfcMetadata.see_also && rfcMetadata.see_also.length > 0) {
      // rfc.see_also.map((item) => formatRfcNumber(item.number, layout))
      // }

      //   push(JSON.stringify(rfcMetadata))

      push('</bcp-entry>\n')
    })

    offset += response.results.length

    console.log(
      offset,
      '>',
      largestRfcNumber,
      offset > largestRfcNumber,
      ' | ',
      response.results.length
    )

    if (
      response.results.some(
        (rfcMetadata) => rfcMetadata.number === largestRfcNumber
      )
    ) {
      if (!abortController.signal.aborted) {
        push('</rfc-index>')
      }
      close()
      return
    }

    await setTimeoutPromise(delayBetweenRequestsMs)
  }
}

const padNumber = (number: number, longestRfcNumberLength: number): string =>
  padStart(number.toString(), longestRfcNumberLength, '0')

const setTimeoutPromise = (timerMs: number) =>
  new Promise((resolve) => setTimeout(resolve, timerMs))

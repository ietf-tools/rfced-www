import { DateTime } from 'luxon'
import { XMLBuilder } from 'fast-xml-parser'
import type { ApiClient } from '~/generated/red-client'

type DocListArg = Parameters<ApiClient['red']['docList']>[0]

type Props = {
  push: (data: string) => void
  close: () => void
  abortController: AbortController
  redApi: ApiClient
  delayBetweenRequestsMs: number
}

export async function renderRfcIndexDotXml(props: Props) {
  const { push } = props
  push('<?xml version="1.0" encoding="UTF-8"?>\n')
  push(
    '<rfc-index xmlns="https://www.rfc-editor.org/rfc-index" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="https://www.rfc-editor.org/rfc-index https://www.rfc-editor.org/rfc-index.xsd">\n'
  )
  await renderBCPs(props)
  await renderFYIs(props)
  await renderRFCs(props)
  await renderSTDs(props)
  push('</rfc-index>')
  close()
}

type XMLBuilderOptions = NonNullable<
  ConstructorParameters<typeof XMLBuilder>[0]
>

const xmlBuilderOptions: XMLBuilderOptions = {
  ignoreAttributes: true,
  attributeNamePrefix: '',
  format: true,
  suppressBooleanAttributes: true,
  indentBy: '  ',
  textNodeName: '#text'
}

const renderBCPs = async (props: Props) => {
  console.log(props.delayBetweenRequestsMs) // FIXME: remove this
  // FIXME: render BCPs
}

const renderFYIs = async (props: Props) => {
  console.log(props.delayBetweenRequestsMs) // FIXME: remove this
  // FIXME: render FYIs
}

const renderRFCs = async ({
  push,
  abortController,
  redApi,
  delayBetweenRequestsMs
}: Props) => {
  const docListArg: DocListArg = {}
  docListArg.sort = ['-number'] // sort by oldest RFC to find the end
  docListArg.limit = 1 // we only need one result
  const response = await redApi.red.docList(docListArg)
  const largestRfcNumber = response.results[0].number
  // const longestRfcNumberLength = largestRfcNumber.toString().length

  const builder = new XMLBuilder({
    ...xmlBuilderOptions,
    arrayNodeName: 'rfc-entry'
  })

  docListArg.sort = ['number'] // sort by first RFC
  let offset = 0

  while (!abortController.signal.aborted) {
    docListArg.offset = offset
    docListArg.limit = 1000

    const response = await redApi.red.docList(docListArg)

    response.results.forEach((rfcMetadata) => {
      const [month, year] = DateTime.fromISO(rfcMetadata.published)
        .toFormat('LLLL yyyy')
        .split(' ')

      const abstractParagraphs = (rfcMetadata.abstract ?? '').split('\n')

      // FIXME: replace with RFC formats when the API has them
      const formats = ['HTML', 'TEXT', 'PDF', 'XML']

      const rfc = {
        'rfc-entry': {
          'doc-id': `RFC${rfcMetadata.number}`,
          title: rfcMetadata.title,
          ...(rfcMetadata.authors.length > 0 ?
            {
              author: {
                name: rfcMetadata.authors
              }
            }
          : {}),
          date: { month, year },
          format: {
            'file-format': formats
          },
          'page-count': rfcMetadata.pages,
          keywords: {
            // @ts-expect-error update when client provides that
            kw: rfcMetadata.keywords
          },
          ...(abstractParagraphs.length > 0 ?
            {
              abstract:
                // Certain RFCs have multiple paragraphs such as RFC1849, RFC2169, RFC2178, RFC2660, RFC3318, RFC3867, RFC3873, RFC3875, RFC3886, RFC3890, RFC3894, RFC3903, RFC3918, RFC3919, RFC3927, RFC3932, RFC3933, RFC3938, RFC3945, RFC3949, RFC3965, RFC3974, RFC3987, RFC3995, RFC4005, RFC4010, RFC4025, RFC4026, RFC4034, RFC4035, RFC4040, RFC4041, RFC4042, RFC4043, RFC4053, RFC4061, RFC4078, RFC4080, RFC4082, RFC4086, RFC4088, RFC4090 etc...
                abstractParagraphs.map((abstractParagraph) => ({
                  p: abstractParagraph
                }))
            }
          : {}),
          draft: 'draft-ietf-lamps-cms-cek-hkdf-sha256-05',
          'current-status': rfcMetadata.status.slug,
          'publication-status': rfcMetadata.status.slug,
          stream: rfcMetadata.stream.name,
          area: rfcMetadata.area,
          wg_acronym: rfcMetadata.group.acronym,
          doi:
            rfcMetadata.identifiers?.find(
              (identifier) => identifier.type === 'doi'
            )?.value ?? undefined
        }
      }

      const xml = builder.build(rfc)

      push(xml)
    })

    offset += response.results.length

    if (
      response.results.some(
        (rfcMetadata) => rfcMetadata.number === largestRfcNumber
      )
    ) {
      return
    }

    if (delayBetweenRequestsMs > 0) {
      await setTimeoutPromise(delayBetweenRequestsMs)
    }
  }
}

const renderSTDs = async (props: Props) => {
  console.log(props.delayBetweenRequestsMs) // FIXME: remove this
  // FIXME: render STDs
}

const setTimeoutPromise = (timerMs: number) =>
  new Promise((resolve) => setTimeout(resolve, timerMs))

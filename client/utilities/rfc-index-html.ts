import { DateTime } from 'luxon'
import type { getAllRFCs } from './redClientWrappers'
import { formatAuthor } from './rfc'
import { rfcPathBuilder } from './url'
import { COMMA } from './strings'

type Rfc = Awaited<ReturnType<typeof getAllRFCs>>[number]

export const rfcToRfcSummary = (rfc: Rfc) => {
  const [month, year] = DateTime.fromISO(rfc.published)
    .toFormat('LLLL yyyy')
    .split(' ')

  const body = h('span', [
    rfc.authors.map(formatAuthor),
    ` [ ${month} ${year} ] `,
    rfc.formats ?
      `(${rfc.formats.map((format) => format.type).join(', ')})`
    : '',
    rfcCommaList(rfc.obsoletes),
    ` (Status: ${rfc.status.name})`,
    ` (Stream: ${rfc.stream.name})`,
    rfc.identifiers ?
      `(${rfc.identifiers.map((identifier) => `${identifier.type}: ${identifier.value}`)})`
    : ''
  ])

  return {
    number: rfc.number,
    heading: rfc.title,
    body
  }
}

const rfcCommaList = (rfcs?: { number: number }[]) =>
  rfcs ?
    rfcs
      .map((rfc): VNode | string => {
        return h(
          'a',
          { href: rfcPathBuilder(`rfc${rfc.number}`) },
          `RFC${rfc.number}`
        )
      })
      .reduce(
        (acc, item, index, arr) => {
          acc.push(item)
          if (index < arr.length - 1) {
            arr.push(`${COMMA} `)
          }
          return acc
        },
        [] as (VNode | string)[]
      )
  : []

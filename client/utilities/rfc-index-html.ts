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
    h('b', rfc.title),
    ' ',
    ...rfc.authors.map(formatAuthor),
    ` [ ${month} ${year} ] `,
    rfc.formats ?
      `(${rfc.formats.map((format) => format.type).join(', ')})`
    : '',
    ...(rfc.obsoletes && rfc.obsoletes.length > 0 ?
      [' (Obsoletes ', ...rfcCommaList(rfc.obsoletes), ' )']
    : []),
    ...(rfc.obsoleted_by && rfc.obsoleted_by.length > 0 ?
      [' (Obsoleted-By ', ...rfcCommaList(rfc.obsoleted_by), ' )']
    : []),
    ...(rfc.updated_by && rfc.updated_by.length > 0 ?
      [' (Updated-By ', ...rfcCommaList(rfc.updated_by), ' )']
    : []),
    ` (Status: ${rfc.status.name.toUpperCase()})`,
    ` (Stream: ${rfc.stream.name})`,
    ' ',
    rfc.identifiers ?
      `(${rfc.identifiers.map((identifier) => `${identifier.type.toUpperCase()}: ${identifier.value}`)})`
    : ''
  ])

  return {
    number: rfc.number,
    heading: rfc.title,
    body
  }
}

export const rfcCommaList = (rfcs?: { number: number }[]) =>
  rfcs ?
    rfcs
      .map((rfc): VNode | string =>
        h('a', { href: rfcPathBuilder(`rfc${rfc.number}`) }, `RFC${rfc.number}`)
      )
      .reduce(
        (acc, item, index, arr) => {
          acc.push(item)
          if (index < arr.length - 1) {
            acc.push(` ${COMMA} `)
          }
          return acc
        },
        [] as (VNode | string)[]
      )
  : []

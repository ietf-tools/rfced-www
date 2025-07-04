import { DateTime } from 'luxon'
import { blankRfcCommon, parseRFCId } from './rfc'
import type { RfcCommon, RfcBucketHtmlDocument, RFCJSON } from './rfc'
import {
  formatAuthor,
  formatDatePublished,
  formatFormat,
  isTocSection,
  parseRfcFormat,
  parseRfcJsonPubDateToISO,
  parseRfcStatusSlug,
  parseTypeSenseSubseries
} from './rfc-converters-utils'
import { TypeSenseSearchItemSchema } from './typesense'
import type { TypeSenseSearchItem } from './typesense'
import type { RfcEditorToc } from './tableOfContents'
import { getDOMParser, isHtmlElement, isTextNode } from './dom'
import type { Rfc, RfcMetadata } from '~/generated/red-client'

/**
 * Caches response to avoid computation but mostly to make === comparisons of RFCs easier
 */
const cacheResponse = <T extends Rfc | RfcMetadata>(
  fn: (rfcData: T) => RfcCommon
): ((rfcData: T) => RfcCommon) => {
  const cache: Record<string, RfcCommon> = {}

  return (rfcData: T) => {
    const cacheKey = `${rfcData.number}`
    if (!(cacheKey in cache)) {
      cache[cacheKey] = fn(rfcData)
    }
    return cache[cacheKey]
  }
}

export const rfcMetadataToRfcCommon = cacheResponse(
  (rfcMetadata: RfcMetadata): RfcCommon => {
    return {
      ...blankRfcCommon,
      number: rfcMetadata.number,
      abstract: rfcMetadata.abstract,
      published: rfcMetadata.published,
      status: parseRfcStatusSlug(rfcMetadata.status.slug),
      pages: rfcMetadata.pages,
      authors: rfcMetadata.authors,
      group: rfcMetadata.group,
      area: rfcMetadata.area,
      stream: rfcMetadata.stream,
      identifiers: rfcMetadata.identifiers,
      obsoleted_by: rfcMetadata.obsoleted_by,
      updated_by: rfcMetadata.updated_by,
      title: rfcMetadata.title
    }
  }
)

export const rfcToRfcCommon = cacheResponse((rfc: Rfc): RfcCommon => {
  return {
    ...blankRfcCommon,
    number: rfc.number,
    abstract: rfc.abstract,
    published: rfc.published,
    status: parseRfcStatusSlug(rfc.status.slug),
    pages: rfc.pages,
    authors: rfc.authors,
    group: rfc.group,
    area: rfc.area,
    stream: rfc.stream,
    identifiers: rfc.identifiers,
    obsoleted_by: rfc.obsoleted_by,
    updated_by: rfc.updated_by,
    title: rfc.title
  }
})

/**
 * Converts between types of RFC data
 */
export const rfcToRfcJSON = (rfc: Rfc): RFCJSON => {
  const date = DateTime.fromISO(rfc.published)

  return {
    draft: rfc.draft?.name ?? '',
    doc_id: `RFC${rfc.number}`,
    title: rfc.title,
    authors: rfc.authors.map((author) => formatAuthor(author, 'regular')) ?? [],
    format: rfc.formats.map((format) =>
      formatFormat(
        format,
        // FIXME: get info on whether it's a pre-V3 rfc.... or ensure API will return ASCII
        true
      )
    ),
    page_count: rfc.pages?.toString() ?? '0',
    pub_status: rfc.status.name.toUpperCase(),
    status: rfc.status.name.toUpperCase(),
    source: rfc.stream.name,
    abstract: rfc.abstract,
    pub_date: formatDatePublished(date, false),
    keywords: rfc.keywords ?? [],
    obsoletes: rfc.obsoletes?.map((obsolete) => `RFC${obsolete.number}`) ?? [],
    obsoleted_by:
      rfc.obsoleted_by?.map((obsoleted_by) => `RFC${obsoleted_by.number}`) ??
      [],
    updates: rfc.updates?.map((update) => `RFC${update.number}`) ?? [],
    updated_by:
      rfc.updated_by?.map(
        (updated_by_item) => `RFC${updated_by_item.number}`
      ) ?? [],
    see_also: rfc.see_also ?? [],
    doi:
      rfc.identifiers?.find((identifier) => identifier.type === 'doi')?.value ??
      null,
    errata_url: rfc.errata?.[0] ?? null
  }
}

/**
 * Converts between types of RFC data
 * FIXME: this is losing details
 */
export const rfcJSONToRfcCommon = (rfcJson: RFCJSON): RfcCommon => {
  return {
    number: parseInt(parseRFCId(rfcJson.doc_id).number, 10),
    title: rfcJson.title,
    published: parseRfcJsonPubDateToISO(rfcJson.pub_date),
    status: parseRfcStatusSlug(rfcJson.status),
    pages: parseInt(rfcJson.page_count, 10),
    authors: rfcJson.authors.map((authorName) => ({
      person: 0,
      name: authorName
    })),
    group: {
      acronym: rfcJson.source,
      name: rfcJson.source
    },
    area: undefined,
    stream: {
      slug: rfcJson.source,
      name: rfcJson.source
    },
    identifiers:
      rfcJson.doi ?
        [
          {
            type: 'doi',
            value: rfcJson.doi
          }
        ]
      : [],
    obsoletes: rfcJson.obsoletes.map(
      (obsolete): NonNullable<Rfc['obsoletes']>[number] => {
        const rfcId = parseRFCId(obsolete)
        return {
          id: 0,
          number: parseInt(rfcId.number, 10),
          title: obsolete
        }
      }
    ),
    obsoleted_by: rfcJson.obsoleted_by.map(
      (obsoleted_by_item): NonNullable<Rfc['obsoleted_by']>[number] => {
        const rfcId = parseRFCId(obsoleted_by_item)
        return {
          id: 0,
          number: parseInt(rfcId.number, 10),
          title: obsoleted_by_item
        }
      }
    ),
    updates: rfcJson.updates.map(
      (update): NonNullable<Rfc['updates']>[number] => {
        const rfcId = parseRFCId(update)
        return {
          id: 0,
          number: parseInt(rfcId.number, 10),
          title: update
        }
      }
    ),
    updated_by: rfcJson.updated_by.map(
      (updated_by_item): NonNullable<Rfc['updated_by']>[number] => {
        const rfcId = parseRFCId(updated_by_item)
        return {
          id: 0,
          number: parseInt(rfcId.number, 10),
          title: updated_by_item
        }
      }
    ),
    is_also: undefined,
    see_also: rfcJson.see_also,
    draft: {
      id: 0,
      name: rfcJson.draft,
      title: rfcJson.draft
    },
    abstract: rfcJson.abstract,
    formats: rfcJson.format.map(parseRfcFormat),
    keywords: rfcJson.keywords,
    errata: [],
    text: ''
  }
}

export const typeSenseSearchItemToRFCCommon = (
  unverifiedTypeSenseSearchItem: TypeSenseSearchItem
): RfcCommon => {
  const result = TypeSenseSearchItemSchema.safeParse(
    unverifiedTypeSenseSearchItem
  )
  if (result.error) {
    console.error(result.error.toString())
    throw Error(result.error.toString())
  }

  const item = result.data

  const published = new Date(item.publicationDate * 1000).toISOString()
  const authors =
    item.authors?.map((author, index) => ({
      person: index,
      name: author.name
    })) ?? []

  return {
    abstract: item.abstract,
    area:
      item.area ?
        {
          name: item.area.name,
          acronym: item.area.acronym
        }
      : undefined,
    authors,
    formats: [],
    group: {
      acronym: item.group.acronym,
      name: item.group.name
    },
    number: item.rfcNumber,
    published,
    subseries: item.status?.name ? parseTypeSenseSubseries(item) : undefined,
    status: parseRfcStatusSlug(item.status?.name),
    stream: {
      name: item.stream?.name || 'unknown',
      slug: item.stream?.slug || 'Unknown'
    },
    text: '',
    title: item.title
  }
}

export const rfcBucketHtmlToRfcDocument = async (
  rfcBucketHtml: string
): Promise<RfcBucketHtmlDocument> => {
  const parser = await getDOMParser()
  const dom = parser.parseFromString(rfcBucketHtml, 'text/html')

  let tableOfContents: RfcEditorToc | undefined

  const rfc: RfcCommon = {
    ...blankRfcCommon
  }

  // Parse useful stuff from <head>
  const headNodes = Array.from(dom.head.childNodes)
  headNodes.forEach((node) => {
    if (isHtmlElement(node)) {
      let name: string | null,
        content: string | null,
        rel: string | null,
        href: string | null

      switch (node.nodeName.toLowerCase()) {
        case 'meta':
          name = node.getAttribute('name')
          content = node.getAttribute('content')
          if (content) {
            switch (name) {
              case 'author':
                rfc.authors.push({
                  name: content
                })
                break
              case 'description':
                rfc.abstract = content
                break
              case 'rfc.number':
                if (rfc.number === blankRfcCommon.number) {
                  rfc.number = parseInt(content, 10)
                }
                break
              case 'keyword':
                if (rfc.keywords === undefined) {
                  rfc.keywords = []
                }
                rfc.keywords.push(content)
                break
            }
          }
          break
        case 'title':
          // don't try to parse the <title> because it has both the RFC title and RFC number in it,
          // so we'll use other parts of the HTML (the title in the <body>) which are easier to use
          break
        case 'link':
          rel = node.getAttribute('rel')
          href = node.getAttribute('href')
          if (href && rel) {
            if (rel === 'alternate') {
              if (rfc.identifiers === undefined) {
                rfc.identifiers = []
              }

              if (href.includes('doi.org')) {
                rfc.identifiers.push({
                  type: 'doi',
                  value: href
                })
              } else if (href.includes('urn:issn:')) {
                rfc.identifiers.push({
                  type: 'issn',
                  value: href
                })
              }
            }
          }
          break
      }
    }
  })

  // Parse useful stuff from <body>
  const bodyNodes = Array.from(dom.body.childNodes)
  const rfcDocument = bodyNodes.filter((node) => {
    if (isHtmlElement(node)) {
      switch (node.nodeName.toLowerCase()) {
        case 'script':
          return false
        case 'table':
          if (node.classList.contains('ears')) {
            return false
          }
          break
      }

      if (node.id === 'rfcnum' && rfc.number === blankRfcCommon.number) {
        rfc.number = parseInt(node.innerText.replace(/[^0-9]/gi, ''), 10)
      } else if (node.id === 'title') {
        rfc.title = node.innerText
      } else if (node.id === 'toc') {
        tableOfContents = parseRfcBucketHtmlToc(node)
      }

      const idsToRemove = ['toc', 'external-metadata', 'internal-metadata']
      if (idsToRemove.includes(node.id)) {
        return false
      }
    }
    return true
  })

  const documentHtml = rfcDocument
    .map((node): string => {
      if (isHtmlElement(node)) {
        return node.outerHTML
      } else if (isTextNode(node)) {
        return node.textContent ?? ''
      }
      return ''
    })
    .join('')
    .trim()

  return {
    rfc,
    tableOfContents,
    documentHtml
  }
}

type TocSections = RfcEditorToc['sections']
type TocSection = TocSections[number]

const parseRfcBucketHtmlToc = (toc: HTMLElement): RfcEditorToc => {
  const walk = (node: Node): TocSection | undefined => {
    if (isHtmlElement(node)) {
      if (node.nodeName.toLowerCase() === 'li') {
        const links = Array.from(node.childNodes)
          .flatMap((childNode) => {
            if (
              isHtmlElement(childNode) &&
              childNode.nodeName.toLowerCase() !== 'ul'
            ) {
              const internalLinks = childNode.querySelectorAll('a')
              return Array.from(internalLinks).map((internalLink) => {
                if (isHtmlElement(internalLink)) {
                  const href = internalLink.getAttribute('href')
                  if (
                    href?.startsWith('#')
                    // it's an internal link, assume a TOC link
                  ) {
                    const title = getInnerText(internalLink)
                    if (title.length > 0) {
                      return {
                        id: href.substring(1),
                        title
                      }
                    }
                  } else {
                    console.warn(
                      `Found non TOC link`,
                      href,
                      internalLink.outerHTML
                    )
                  }
                } else {
                  throw Error(`Didn't expect non-element. Was ${internalLink}`)
                }
              })
            }
          })
          .filter((link): link is TocSection['links'][number] => {
            return !!link
          })

        const subsections = Array.from(node.childNodes)
          .map((childNode) => {
            if (
              isHtmlElement(childNode) &&
              childNode.nodeName.toLowerCase() === 'ul'
            ) {
              return Array.from(childNode.childNodes)
                .map(walk)
                .filter(isTocSection)
            }
          })
          .filter(
            (
              subsections
            ): subsections is NonNullable<TocSection['sections']> => {
              return !!subsections
            }
          )

        const newSection: TocSection = {
          links
        }

        if (subsections.length > 0 && subsections[0].length > 0) {
          newSection.sections = subsections[0]
        }

        return newSection
      }
    }
  }

  const root = toc.querySelector('ul')

  if (!root) {
    throw Error("Couldn't find root node")
  }

  const sections: TocSections = Array.from(root.childNodes)
    .map(walk)
    .filter(isTocSection)

  return {
    title: 'Table of Contents',
    sections
  }
}

export const rfcBucketHtmlFilenameBuilder = (rfcNumber: number) =>
  `rfc${rfcNumber}-html.json`

export const getInnerText = (element: HTMLElement): string => {
  return Array.from(element.childNodes)
    .map((node) => {
      if (isHtmlElement(node)) {
        return getInnerText(node)
      } else if (isTextNode(node)) {
        return node.textContent
      }
      return ''
    })
    .join('')
}

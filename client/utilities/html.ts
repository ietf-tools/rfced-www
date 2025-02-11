import { XMLParser } from 'fast-xml-parser'

export const parseHtml = (html: string) => {
  const parser = new XMLParser({
    // HTML parse mode config
    preserveOrder: true,
    ignoreAttributes: false,
    unpairedTags: ['hr', 'br', 'link', 'meta'],
    stopNodes: ['*.pre', '*.script'],
    processEntities: true,
    htmlEntities: true
  })
  return parser.parse(html)
}

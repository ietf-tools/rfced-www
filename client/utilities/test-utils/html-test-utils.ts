import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import type { X2jOptions, XmlBuilderOptions } from 'fast-xml-parser'

/**
 *
 * This file is test utilities
 */

export type XMLParserConfig = X2jOptions

/**
 * XML Parser has some defaults (eg discarding whitespace) that don't suit our needs
 * so here's our default config
 */
const parserDefaultConfig: X2jOptions = {
  preserveOrder: true,
  ignoreAttributes: false,
  trimValues: false, // preserve whitespace
  processEntities: false
}

export const getXMLParser = (additionalConfig?: X2jOptions) =>
  new XMLParser({
    ...parserDefaultConfig,
    ...additionalConfig
  })

export type XMLBuilderOptions = XmlBuilderOptions

/**
 * XML Builder has some defaults (eg discarding attributes) that don't suit our needs
 * so here's our default config
 */
const builderDefaultConfig: XmlBuilderOptions = {
  ignoreAttributes: false
}

export const getXMLBuilder = (additionalConfig: XmlBuilderOptions) =>
  new XMLBuilder({ ...builderDefaultConfig, ...additionalConfig })

/**
 * This should only be used in tests.
 * It's useful because it returns a JSON serializable data structure (rather than objects)
 * so vitest can test/diff data structures easily.
 *
 * If you need an HTML parser but not for tests (eg in Vue/Nuxt) then try
 * The Platform[tm] https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
 */
export const parseHtml = (html: string) => {
  const parser = getXMLParser({
    // HTML parse mode config
    unpairedTags: ['hr', 'br', 'link', 'meta'],
    stopNodes: ['*.pre', '*.script'],
    htmlEntities: true
  })
  return parser.parse(html)
}

type NodeHandler = (node: unknown) => Promise<void>

export const walkNodes = async (
  nodeList: unknown[],
  nodeHandler: NodeHandler
) => {
  await Promise.all(
    nodeList.map(async (node: unknown) => {
      await nodeHandler(node)

      // walk deeper
      if (node && typeof node === 'object') {
        await Promise.all(
          Object.keys(node).map(async (key) => {
            const item = (node as Record<string, unknown>)[key]

            if (Array.isArray(item)) {
              await walkNodes(item, nodeHandler)
            }
          })
        )
      } else {
        console.log(node)
        throw Error('Unexpected state')
      }
    })
  )
}

export const getInnerText = async (nodeList: unknown[]): Promise<string> => {
  const innerText: string[] = []
  await walkNodes(nodeList, async (node) => {
    if (!node || typeof node !== 'object' || !('#text' in node)) return
    const textNodeValue = node['#text']
    if (typeof textNodeValue !== 'string') throw Error('unable to extract text')
    innerText.push(textNodeValue)
  })
  return innerText.join('')
}

export const filterByElementName = (
  nodeList: unknown[],
  elementName: string
): unknown[] => {
  return nodeList.filter((node) => {
    return node && typeof node === 'object' && elementName in node
  })
}

/**
 * For a node in a document returned by `parseHtml()`
 *
 * expects a data structure that looks like
 * ```json
 * {
 *   "A": { "#text": "zombo" },
 *   ":@href": "http://zombo.com/"
 * }
 * ```
 */
export const attemptToGetAttribute = (
  node: unknown,
  elementName: string,
  attributeName: string
): string | undefined => {
  const NODE_ATTRIBUTES_KEY = ':@'
  if (
    !node ||
    typeof node !== 'object' ||
    !(elementName in node) ||
    !(NODE_ATTRIBUTES_KEY in node)
  ) {
    return
  }

  const attributes = node[NODE_ATTRIBUTES_KEY]

  if (!attributes || typeof attributes !== 'object') {
    return
  }

  const nodeKey = `@_${attributeName}`
  const attribute = (attributes as Record<string, unknown>)[nodeKey]

  if (typeof attribute === 'string') {
    return attribute
  }
}

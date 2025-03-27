import { XMLParser } from 'fast-xml-parser'

export const parseHtml = (html: string) => {
  const parser = new XMLParser({
    // HTML parse mode config
    preserveOrder: true,
    ignoreAttributes: false,
    unpairedTags: ['hr', 'br', 'link', 'meta'],
    stopNodes: ['*.pre', '*.script'],
    processEntities: true,
    htmlEntities: true,
    trimValues: false
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
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target
 */
export const TARGET_NEW_WINDOW = '_blank'

/**
 * `noopener` prevents external sites having control over originating links via JavaScript
 * https://mathiasbynens.github.io/rel-noopener/
 * it's intentional to not have `noreferrer` here
 **/
export const EXTERNAL_LINK_REL = 'noopener'

export type AnchorProps = { href: string } & Partial<
  Omit<
    /* @vue-ignore */ HTMLAnchorElement, // for vue-ignore see https://github.com/vuejs/core/issues/11123#issuecomment-2168310426
    'style' | 'translate' | 'role' | 'prefix' | 'href' // these ommissions are types from HTMLAnchorElement that are incompatible with prop values (according to TypeScript). If you need them you could re-add them with custom types.
  >
>

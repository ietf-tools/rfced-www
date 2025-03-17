// @vitest-environment nuxt
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import { test, expect } from 'vitest'
import { escapeRegExp, kebabCase } from 'lodash-es'
import { micromark } from 'micromark'
import { globby } from 'globby'
import { getInnerText, parseHtml, walkNodes } from '~/utilities/html'
import {
  infoRfcPathBuilder,
  PUBLIC_SITE,
  rfcPathBuilder
} from '~/utilities/url'
import contentMetadata from '~/generated/content-metadata.json'

const __dirname = import.meta.dirname
const clientPath = path.resolve(__dirname, '..')
const contentPath = path.resolve(clientPath, 'content')
const publicPath = path.resolve(clientPath, 'public')
type Metadata = {
  markdownPath: string
  markdownData: string
  html: string
  links: string[]
}

const markdownLinks = Object.keys(
  contentMetadata
) as (keyof typeof contentMetadata)[]

test('Markdown links validation', async () => {
  // Unfortunately Nuxt Content's queryCollection() utils can't run in tests only in server routes
  // so we have to read the markdown files directly from the filesystem
  const markdownPaths = await globby(['**/*.md'], {
    cwd: contentPath
  })
  // quick sanity check on whether globby matched ANY markdowns
  expect(markdownPaths.length).toBeGreaterThan(0)
  const markdownDatum = await Promise.all(
    markdownPaths.map((markdownPath) =>
      fsPromises.readFile(path.join(contentPath, markdownPath), 'utf-8')
    )
  )
  const htmls = markdownDatum.map((markdownData) => micromark(markdownData))
  const docs = htmls.map((html) => parseHtml(html))

  markdownDatum.forEach((markdownData, index) => {
    validateMarkdown(markdownData, markdownPaths[index])
  })

  const links = await getAllLinks(
    markdownPaths.map((markdownPath, index) => {
      const publicPath = `/${markdownPath.replace(/\.md$/, '/')}`
      if (!(publicPath in contentMetadata)) {
        throw Error(
          `Unrecognised path ${publicPath} (for ${markdownPath}) was not found in ${Object.keys(contentMetadata)}`
        )
      }
      return {
        markdownPath,
        publicPath,
        html: htmls[index],
        doc: docs[index]
      }
    })
  )

  await Promise.all(
    htmls.map(async (html, index) => {
      const markdownPath = markdownPaths[index]
      const markdownData = markdownDatum[index]
      const doc = docs[index]
      const metadata: Metadata = {
        markdownPath,
        markdownData,
        html,
        links
      }
      await walkNodes(doc, (node) => validateImage(node, metadata))
      await walkNodes(doc, (node) => validateLink(node, metadata))
    })
  )
})

const validateMarkdown = (markdownData: string, markdownPath: string): void => {
  const badInternalLink = '](<#' // when converting from Google Doc it often makes broken links with this signature
  expect(
    markdownData,
    `Markdown file ${markdownPath} included bad data ${badInternalLink}`
  ).not.toMatch(badInternalLink)
}

const validateImage = async (node: unknown, metadata: Metadata) => {
  const src = attemptToGetAttribute(node, 'img', 'src')
  if (!src) return
  const { markdownPath } = metadata

  const expectedPrefix = `/images/${markdownPath.replace(/\.md$/, '')}-`
  const expectedPrefixRegexp = new RegExp(`^${escapeRegExp(expectedPrefix)}`)
  expect(
    src,
    `Markdown file ${markdownPath} references image that doesn't match filename naming convention (prefixed with ${expectedPrefix})`
  ).toMatch(expectedPrefixRegexp)

  const assetFilePath = path.join(publicPath, src)
  const hasImageFile = await fileExists(assetFilePath)
  expect(
    hasImageFile,
    `Markdown file ${markdownPath} references image ${src} that doesn't exist`
  ).toBe(true)
}

const validateLink = async (node: unknown, metadata: Metadata) => {
  const href = attemptToGetAttribute(node, 'a', 'href')
  if (!href) return

  const expectLink = (
    href: string,
    expectedHref: string,
    markdownPath: string
  ): void => {
    expect(
      href,
      `Markdown link in ${markdownPath} was "${href}" but should be ${expectedHref}`
    ).toBe(expectedHref)
  }

  const { markdownPath } = metadata

  const { pathname, hash } = new URL(href, PUBLIC_SITE)

  if (href.includes(PUBLIC_SITE)) {
    return expectLink(href, `${pathname}${hash}`, markdownPath)
  }

  if (
    href.startsWith('//') ||
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:')
  ) {
    // external links, and mailto: links, are assumed to be valid
    return
  }

  if (
    /**
     * Some probably valid paths
     */
    pathname.endsWith('.pdf') ||
    pathname.endsWith('.txt') ||
    pathname.endsWith('.xml') ||
    pathname.endsWith('.xsd') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.tar.gz') ||
    pathname.endsWith('.zip')
  ) {
    // these links appear to adhere to the new URL structure
    return
  }

  if (pathname.endsWith('.php')) {
    // if it ends in .php then it's the old URL structure which is a test failure
    // we'll use expectLink to generate a nice error message
    const expectedUrl = href.replace(/\.php$/gi, '/')
    return expectLink(href, expectedUrl, markdownPath)
  }

  if (pathname.endsWith('.html')) {
    // if it ends in .html then it's the old URL structure which is a test failure
    // we'll use expectLink to generate a nice error message
    return expectLink(href, href.replace(/\.html$/gi, '/'), markdownPath)
  }

  if (pathname.startsWith('/rfc/')) {
    const expectedUrl = rfcPathBuilder(pathname.substring('/rfc/'.length))
    return expectLink(href, expectedUrl, markdownPath)
  }

  if (pathname.startsWith('/info/')) {
    const expectedUrl = infoRfcPathBuilder(pathname.substring('/info/'.length))
    return expectLink(href, expectedUrl, markdownPath)
  }

  if (
    // a valid markdown path
    pathname in contentMetadata
  ) {
    return
  }

  if (href.startsWith('#')) {
  }

  throw Error(
    `Unhandled Markdown link in ${markdownPath} was "${href}". Please update link validation test.`
  )
}

/**
 * For the data structure returns by parseHtml
 */
const attemptToGetAttribute = (
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

const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fsPromises.stat(filePath)
    return true
  } catch {
    return false
  }
}

type HtmlPages = {
  markdownPath: string
  publicPath: string
  html: string
  doc: ReturnType<typeof parseHtml>
}[]
const getAllLinks = async (htmlPages: HtmlPages): Promise<string[]> => {
  const getInternalLinks = (htmlPages: HtmlPages) => {
    const htmlInternalLinks = htmlPages
      .map((htmlPage) => {
        const { publicPath, doc } = htmlPage
        const headingText: string[] = []
        walkNodes(doc, async (node) => {
          if (
            node &&
            typeof node === 'object' &&
            ('h1' in node ||
              'h2' in node ||
              'h3' in node ||
              'h4' in node ||
              'h5' in node ||
              'h6' in node)
          ) {
            headingText.push(await getInnerText([node]))
          }
        })

        return headingText.map(
          (headingText) =>
            `${publicPath}#${kebabCase(headingText.toLowerCase())}`
        )
      })
      .reduce((acc, item) => {
        acc.push(...item)
        return acc
      }, [])

    return htmlInternalLinks
  }
  return [...markdownLinks, ...getInternalLinks(htmlPages)]
}

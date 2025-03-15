// @vitest-environment nuxt
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import { test, expect } from 'vitest'
import { escapeRegExp } from 'lodash-es'
import { micromark } from 'micromark'
import { globby } from 'globby'
import { parseHtml } from '~/utilities/html'
import {
  infoRfcPathBuilder,
  PUBLIC_SITE,
  rfcPathBuilder
} from '~/utilities/url'

const __dirname = import.meta.dirname
const clientPath = path.resolve(__dirname, '..')
const contentPath = path.resolve(clientPath, 'content')
const publicPath = path.resolve(clientPath, 'public')

type NodeValidator = (node: unknown, markdownPath: string) => Promise<void>

test('Markdown links validation', async () => {
  // Unfortunately Nuxt Content's queryCollection() utils can't run in tests only in server routes
  // so we have to read the markdown files directly from the filesystem
  const markdownPaths = await globby(['**/*.md'], {
    cwd: contentPath
  })

  // quick sanity check on whether globby matched ANY markdowns
  expect(markdownPaths.length).toBeGreaterThan(0)

  const markdowns = await Promise.all(
    markdownPaths.map((markdownPath) =>
      fsPromises.readFile(path.join(contentPath, markdownPath), 'utf-8')
    )
  )

  markdowns.forEach((markdown, index) => {
    const markdownPath = markdownPaths[index]
    const badInternalLink = '](<#' // when converting from Google Doc it often makes broken links with this signature
    expect(
      markdown,
      `Markdown file ${markdownPath} included bad data ${badInternalLink}`
    ).not.toMatch(badInternalLink)
  })

  const htmls = markdowns.map((markdown) => micromark(markdown))

  const validateImage: NodeValidator = async (node, markdownPath) => {
    const src = attemptToGetAttribute(node, 'img', 'src')
    if (!src) return

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

  const validateLink: NodeValidator = async (node, markdownPath) => {
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
       * Some valid paths
       */
      pathname.endsWith('/') || // trailing / is an HTML route
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
      const expectedUrl = infoRfcPathBuilder(
        pathname.substring('/info/'.length)
      )
      return expectLink(href, expectedUrl, markdownPath)
    }

    throw Error(
      `Unhandled Markdown link in ${markdownPath} was "${href}". Please update link validation test.`
    )
  }

  await Promise.all(
    htmls.map(async (html, index) => {
      const markdownPath = markdownPaths[index]
      const doc = parseHtml(html)

      await walkNodes(doc, markdownPath, validateImage)
      await walkNodes(doc, markdownPath, validateLink)
    })
  )
})

const walkNodes = async (
  nodeList: unknown[],
  markdownPath: string,
  validateNode: NodeValidator
) => {
  await Promise.all(
    nodeList.map(async (node: unknown) => {
      await validateNode(node, markdownPath)

      // walk deeper
      if (node && typeof node === 'object') {
        await Promise.all(
          Object.keys(node).map(async (key) => {
            const item = (node as Record<string, unknown>)[key]

            switch (key) {
              // ignore these
              case '#text':
                return
            }

            if (Array.isArray(item)) {
              await walkNodes(item, markdownPath, validateNode)
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

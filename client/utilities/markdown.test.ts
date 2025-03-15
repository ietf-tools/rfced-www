// @vitest-environment nuxt
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import { test, expect } from 'vitest'
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

test('Markdown links validation', async () => {
  // Unfortunately Nuxt Content's queryCollection can't run in tests only in server routes
  // so we have to read the markdown files directly from the filesystem
  const markdownPaths = await globby(
    [
      '**/*.md',
      '!_*' // markdown files starting with _ are excluded
    ],
    {
      cwd: contentPath
    }
  )
  const markdowns = await Promise.all(
    markdownPaths.map((markdownPath) =>
      fsPromises.readFile(path.join(contentPath, markdownPath), 'utf-8')
    )
  )

  const validateMarkdownText = (html: string, markdownPath: string) => {
    const badInternalLink = '](<#' // when converting from Google Doc it often makes broken links with this signature

    expect(
      html,
      `Markdown file ${markdownPath} included bad data ${badInternalLink}`
    ).not.toMatch(badInternalLink)
  }

  markdowns.forEach((markdowns, index) => {
    const markdownPath = markdownPaths[index]
    validateMarkdownText(markdowns, markdownPath)
  })

  const htmls = markdowns.map((markdown) => micromark(markdown))

  const validateLink = (href: string, markdownPath: string): void => {
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

    const { pathname, hash } = new URL(href, 'http://localhost/') // extract pathname to remove #hash

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

  const validateLinks = (nodeList: unknown[], markdownPath: string): void => {
    nodeList.forEach((node: unknown) => {
      if (node && typeof node === 'object' && 'a' in node && ':@' in node) {
        // found a link
        const attributes = node[':@']
        if (
          attributes &&
          typeof attributes === 'object' &&
          '@_href' in attributes &&
          typeof attributes['@_href'] === 'string'
        ) {
          validateLink(attributes['@_href'], markdownPath)
        }
      }

      // walk deeper
      if (node && typeof node === 'object') {
        Object.keys(node).forEach((key) => {
          if (key.startsWith('@')) return
          const item = (node as Record<string, unknown>)[key]
          if (Array.isArray(item)) {
            validateLinks(item, markdownPath)
          }
        })
      }
    })
  }

  htmls.forEach((html, index) => {
    const markdownPath = markdownPaths[index]

    const doc = parseHtml(html)
    validateLinks(doc, markdownPath)
  })
})

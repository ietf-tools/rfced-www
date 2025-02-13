// @vitest-environment nuxt
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import { test, expect } from 'vitest'
import { micromark } from 'micromark'
import { globby } from 'globby'
import { parseHtml } from '~/utilities/html'
import { infoRfcPathBuilder, rfcPathBuilder } from '~/utilities/url'

const __dirname = import.meta.dirname
const clientPath = path.resolve(__dirname, '..')
const contentPath = path.resolve(clientPath, 'content')

test('Markdown links validation', async () => {
  // Unfortunately Nuxt Content's queryCollection can't run in tests only in server routes
  // so we have to read the markdown files directly from the filesystem
  const markdownPaths = await globby('**/*.md', {
    cwd: contentPath
  })
  const markdowns = await Promise.all(
    markdownPaths.map((markdownPath) =>
      fsPromises.readFile(path.join(contentPath, markdownPath), 'utf-8')
    )
  )
  const htmls = markdowns.map((markdown) => micromark(markdown))

  const validateLink = (href: string, markdownPath: string): void => {
    if (
      href.startsWith('//') ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:')
    ) {
      // external links, and mailto: links, are assumed to be valid
      return
    }

    const { pathname } = new URL(href, 'http://localhost/') // extract pathname to remove #hash

    if (
      /**
       * Some valid paths
       */
      pathname.endsWith('/') ||
      pathname.endsWith('.pdf') ||
      pathname.endsWith('.txt') ||
      pathname.endsWith('.xml') ||
      pathname.endsWith('.xsd') ||
      pathname.endsWith('.png')
    ) {
      // these links appear to adhere to the new URL structure
      return
    }

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

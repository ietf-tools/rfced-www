// @vitest-environment nuxt
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import { test, expect } from 'vitest'
import { escapeRegExp } from 'lodash-es'
import { micromark } from 'micromark'
import { globby } from 'globby'
import { getInnerText, parseHtml, walkNodes } from '~/utilities/html'
import {
  infoRfcPathBuilder,
  PUBLIC_SITE,
  rfcPathBuilder,
  textToAnchorId,
  type MarkdownPaths
} from '~/utilities/url'
import contentMetadata from '~/generated/content-metadata.json'

const __dirname = import.meta.dirname
const clientPath = path.resolve(__dirname, '..')
const contentPath = path.resolve(clientPath, 'content')
const publicPath = path.resolve(clientPath, 'public')
type Metadata = {
  markdownPath: string
  publicPath: string
  markdownData: string
  html: string
  validLinks: string[]
}

const markdownLinks = Object.keys(contentMetadata) as MarkdownPaths[]

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
      const publicPath = markdownPathToPublicPath(markdownPath)
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
        publicPath: markdownPathToPublicPath(markdownPath),
        html,
        validLinks: links
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

  const { markdownPath, publicPath, validLinks } = metadata

  const { pathname, hash } = new URL(href, `${PUBLIC_SITE}${publicPath}`)

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
    const expectedUrl = `${rfcPathBuilder(pathname.substring('/rfc/'.length))}${hash}`
    return expectLink(href, expectedUrl, markdownPath)
  }

  if (pathname.startsWith('/info/')) {
    const expectedUrl = infoRfcPathBuilder(pathname.substring('/info/'.length))
    return expectLink(href, expectedUrl, markdownPath)
  }

  if (validLinks.includes(`${pathname}${hash}`)) {
    return
  }

  throw Error(
    `Broken link in ${markdownPath} was "${href}" (parsed as "${pathname}" "${hash}") but that's not a known page. Near matches were ${JSON.stringify(validLinks.filter((validLink) => validLink.startsWith(pathname)))}`
  )
}

/**
 * For the data structure returns by `parseHtml()`
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

const siteRoutes = [
  '/current_queue/',
  '/reports/subpub_stats/',
  '/IAD-reports/',
  '/rfcs-per-year/',
  '/report-summary/ietf/',
  '/status_changes/',
  '/contact/at-ietf/', // TODO: revise whether this is needed
  '/old/Dec2014/',
  '/pubprocess/', // TODO: revise whether this is needed
  '/series/rfc-faq/#missingauthor', // TODO: REMOVE THIS
  '/series/rfc-faq/#auth48', // TODO: REMOVE THIS
  '/report-summary/2015-2/',
  '/report-summary/report-summary-2016/',
  '/report-summary/report-summary-2017/',
  '/report-summary/report-summary-2018/',
  '/report-summary/report-summary-2019/',
  '/report-summary/report-summary-2020/',
  '/report-summary/report-summary-2021/',
  '/report-summary/report-summary-2022/',
  '/report-summary/report-summary-2023/',
  '/report-summary/report-summary-2024/',
  '/styleguide/part2/', // TODO: revise whether this is needed
  '/styleguide/part2/#ref_ids', // TODO: revise whether this is needed
  '/styleguide/part2/#ref_rfcs', // TODO: revise whether this is needed
  '/styleguide/part2/#ref_repo', // TODO: revise whether this is needed
  '/styleguide/part2/#ref_subseries', // TODO: revise whether this is needed
  '/styleguide/part2/#ref_errata', // TODO: revise whether this is needed
  '/styleguide/part2/#ref_iana_reg', // TODO: revise whether this is needed
  '/styleguide/part2/#ref_email_list', // TODO: revise whether this is needed
  '/styleguide/part2/#index_placement', // TODO: revise whether this is needed
  '/styleguide/part2/#inclusive_language', // TODO: revise whether this is needed
  '/styleguide/part2/#double_no', // TODO: revise whether this is needed
  '/styleguide/part2/#rfc_as_compound', // TODO: revise whether this is needed
  '/styleguide/part2/#abbrev_as_verb', // TODO: revise whether this is needed
  '/styleguide/part2/#exp_abbrev', // TODO: revise whether this is needed
  '/styleguide/part2/#citation_usage', // TODO: revise whether this is needed
  '/styleguide/part2/#use_https', // TODO: revise whether this is needed
  '/styleguide/part2/#keywords_in_quote', // TODO: revise whether this is needed
  '/styleguide/part2/#terms_format', // TODO: revise whether this is needed
  '/styleguide/part2/#terms_section', // TODO: revise whether this is needed
  '/styleguide/part2/#didactic_caps', // TODO: revise whether this is needed
  '/styleguide/part2/#section_length', // TODO: revise whether this is needed
  '/styleguide/part2/#nonascii', // TODO: revise whether this is needed
  '/styleguide/part2/#links', // TODO: revise whether this is needed
  '/errata-definitions/' // TODO: revise whether this is needed
]

type HtmlPages = {
  markdownPath: string
  publicPath: string
  html: string
  doc: ReturnType<typeof parseHtml>
}[]
const getAllLinks = async (htmlPages: HtmlPages): Promise<string[]> => {
  const getInternalLinks = async (htmlPages: HtmlPages): Promise<string[]> => {
    const htmlPagesLinks = await Promise.all(
      htmlPages.map(async (htmlPage) => {
        const { publicPath, doc } = htmlPage
        const headingText: string[] = []
        await walkNodes(doc, async (node) => {
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
          (headingText) => `${publicPath}#${textToAnchorId(headingText)}`
        )
      })
    )

    return htmlPagesLinks.reduce((acc, item) => {
      acc.push(...item)
      return acc
    }, [])
  }
  return [
    ...markdownLinks,
    ...siteRoutes,
    ...(await getInternalLinks(htmlPages))
  ]
}

const markdownPathToPublicPath = (markdownPath: string): string =>
  `/${markdownPath.replace(/\.md$/, '/')}`

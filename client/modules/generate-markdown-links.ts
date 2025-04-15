/**
 * This file is responsible for extracting/generating all links from markdown.
 */
import { watch } from 'chokidar'
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import { micromark } from 'micromark'
import { globby } from 'globby'
import { camelCase } from 'lodash-es'
import {
  attemptToGetAttribute,
  getInnerText,
  parseHtml,
  walkNodes
} from '~/utilities/test-utils/html-test-utils'
import { textToAnchorId } from '~/utilities/url'
import { defineNuxtModule, useLogger } from 'nuxt/kit'

// node --experimental-strip-types ./scripts/generate-content-metadata.ts

const __dirname = import.meta.dirname
const clientPath = path.resolve(__dirname, '..')
const contentPath = path.resolve(clientPath, 'content')
const generatedMarkdownValidHrefs = path.resolve(
  clientPath,
  'types',
  'markdown-valid-hrefs.d.ts'
)
const generatedMarkdownAllHrefs = path.resolve(
  clientPath,
  'generated',
  'report-of-all-markdown-hrefs.ts'
)
const generatedFileWarningHeader = `// Generated file by ${path.basename(import.meta.filename)} DO NOT EDIT\n`

const getMarkdownInit = async () => {
  // Unfortunately Nuxt Content's queryCollection() utils can't run in tests or Node scripts, only in server routes,
  // so we have to read the markdown files directly from the filesystem
  const markdownPaths = await globby(['**/*.md'], {
    cwd: contentPath
  })

  const markdownFilesData = await Promise.all(
    markdownPaths.map((markdownPath) =>
      fsPromises.readFile(path.join(contentPath, markdownPath), 'utf-8')
    )
  )

  const htmls = markdownFilesData.map((markdownFileData) =>
    micromark(markdownFileData)
  )

  const docs = htmls.map((html) => parseHtml(html))

  return { markdownPaths, markdownFilesData, htmls, docs }
}

type Logger = ReturnType<typeof useLogger>

const regenerateValidMarkdownLinks = async (logger: Logger) => {
  const { markdownPaths, docs } = await getMarkdownInit()

  const markdownPathToPublicPath = (markdownPath: string) =>
    `/${markdownPath.replace(/\.md$/, '/')}`

  const markdownsValidHrefs = await Promise.all(
    docs.map(async (doc, index) => {
      const validHrefs = []
      const markdownPath = markdownPaths[index]
      const publicPath = markdownPathToPublicPath(markdownPath)
      const headingsText: string[] = []
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
          headingsText.push(await getInnerText([node]))
        }
      })

      validHrefs.push(
        publicPath,
        ...headingsText.map(
          (headingText) => `${publicPath}#${textToAnchorId(headingText)}`
        )
      )

      return { markdownPath, validHrefs }
    })
  )

  // Generates type MarkdownValidHrefs
  await fsPromises.writeFile(
    generatedMarkdownValidHrefs,
    `${generatedFileWarningHeader}declare type MarkdownValidHrefs =\n  | ${markdownsValidHrefs
      .flatMap((markdownsValidHref) => {
        return markdownsValidHref.validHrefs.map((validHref) =>
          // ensures TS-compatible string escaping when necessary
          // even though it's probably not necessary
          JSON.stringify(validHref)
        )
      })
      .join('\n  | ')};\n\n`
  )

  logger.info(`Regenerated ${path.basename(generatedMarkdownValidHrefs)}`)
}

const regenerateReportForAllMarkdownLinks = async (logger: Logger) => {
  const { markdownPaths, docs } = await getMarkdownInit()
  const markdownsAllHrefs = await Promise.all(
    docs.map(async (doc, index) => {
      const hrefs: string[] = []
      const markdownPath = markdownPaths[index]

      await walkNodes(doc, async (node) => {
        const href = attemptToGetAttribute(node, 'a', 'href')
        if (href !== undefined) {
          hrefs.push(href)
        }
      })

      return { markdownPath, hrefs }
    })
  )

  await fsPromises.writeFile(
    generatedMarkdownAllHrefs,
    `${generatedFileWarningHeader}// Compares markdown hrefs against type ValidHrefs\nimport type { ValidHrefs } from '../utilities/url'\n\n${markdownsAllHrefs
      .map((markdownHrefs) =>
        markdownHrefs.hrefs
          .map(
            (href, index) =>
              `const _${camelCase(markdownHrefs.markdownPath)}${index + 1}: ValidHrefs = ${JSON.stringify(href)} // if there is a TS error fix the Markdown link in ${markdownHrefs.markdownPath}`
          )
          .join('\n')
      )
      .join('\n\n')}`
  )

  logger.info(`Regenerated ${path.basename(generatedMarkdownAllHrefs)}`)
}

export default defineNuxtModule({
  setup(options, nuxt) {
    const markdownFilesPattern = path.join(contentPath, '**', '*.md')
    const watcher = watch(markdownFilesPattern)
    const logger = useLogger('generate-markdown-links', {
      level: options.quiet ? 0 : 3
    })

    watcher.on('change', async (event, path) => {
      await regenerateValidMarkdownLinks(logger)
      await regenerateReportForAllMarkdownLinks(logger)
    })
  }
})

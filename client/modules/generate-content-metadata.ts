import path from 'node:path'
import fs from 'node:fs'
import { simpleGit } from 'simple-git'
import { globby } from 'globby'
import { defineNuxtModule, useLogger } from 'nuxt/kit'

const __dirname = import.meta.dirname
const clientPath = path.resolve(__dirname, '..')
const contentPath = path.resolve(clientPath, 'content')
const contentMetadataPath = path.join(
  clientPath,
  'generated',
  'content-metadata.json'
)

export type ContentMetadata = Record<
  string, // path within content directory
  | {
      mtime: string // timestamp ISO 8601
    }
  | undefined
>

type Logger = ReturnType<typeof useLogger>

const regenerateContentMetadata = async (logger?: Logger) => {
  const contentMarkdownPaths = await globby(path.join(contentPath, '**/*.md'))

  const git = simpleGit()

  const markdownMetadataArray = await Promise.all(
    contentMarkdownPaths.map(
      (contentMarkdownPath) =>
        new Promise<ContentMetadata>((resolve) => {
          git
            .log({
              file: contentMarkdownPath,
              maxCount: 1,
              strictDate: true
            })
            .then((gitLog) => {
              const relativePath = contentMarkdownPath
                .substring(contentPath.length)
                .replace(/\.md$/, '/')
              if (gitLog.latest?.date) {
                resolve({
                  [relativePath]: { mtime: gitLog.latest?.date }
                })
              } else {
                console.warn(
                  `Unable to extract latest Git log time from path ${contentMarkdownPath}. Was it commited to Git?`
                )
                resolve({ [relativePath]: undefined })
              }
            })
        })
    )
  )

  const contentMetadata: ContentMetadata = Object.assign(
    {},
    ...markdownMetadataArray
  )

  fs.writeFileSync(
    contentMetadataPath,
    JSON.stringify(contentMetadata, null, 2)
  )

  logger?.info(` - regenerated ${path.basename(contentMetadataPath)}`)
}

export default defineNuxtModule({
  setup(options, nuxt) {
    const logger = useLogger('generate-content-metadata', {
      level: options.quiet ? 0 : 3
    })

    nuxt.hook('builder:watch', async (_event, watcherPath) => {
      if (
        watcherPath.includes('generated/') ||
        watcherPath.includes('types/')
      ) {
        return
      }
      logger.info(
        `Regenerating content metadata because "${watcherPath}" changed`
      )
      await regenerateContentMetadata(logger)
    })
  }
})

regenerateContentMetadata()

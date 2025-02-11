import path from 'node:path'
import fs from 'node:fs'

import { simpleGit } from 'simple-git'
import { glob } from 'glob'

const __dirname = import.meta.dirname
const clientPath = path.resolve(__dirname, '..')
const contentPath = path.resolve(clientPath, 'content')

const contentMarkdownPaths = await glob(path.join(contentPath, '**/*.md'))

const git = simpleGit()

export type ContentMetadata = Record<
  string, // path within content directory
  | {
      mtime: string // timestamp ISO 8601
    }
  | undefined
>

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
              .replace(/\.md$/, '')
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

const contentMetadataPath = path.join(
  clientPath,
  'generated',
  'content-metadata.json'
)

fs.writeFileSync(contentMetadataPath, JSON.stringify(contentMetadata, null, 2))

console.log(
  'Success: metadata (timestamps) extracted from git and written to',
  contentMetadataPath
)

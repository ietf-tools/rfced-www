import type { DateTime } from 'luxon'
import { linkPreviewImageUrlBuilder } from './url'

export const imagePreviewDimensions = [
  [1200, 630], // OpenGraph (Facebook)
  [1200, 675] // Twitter
] as const

const IMAGE_PREVIEW_ALT_TEXT = 'RFC-Editor: Official home of RFCs'

type WidthHeight = (typeof imagePreviewDimensions)[number]

export type ImagePreviewFilename =
  `link-preview-image-${(typeof imagePreviewDimensions)[number][0]}x${(typeof imagePreviewDimensions)[number][1]}.png`

const SITE_NAME = 'RFC Editor'

type UseRfcEditorProps = {
  title: string
  description?: string
  canonicalUrl: string
  authors?: string
  modifiedTime?: DateTime
  publishedTime?: DateTime
}

export const useRfcEditorHead = (props: UseRfcEditorProps) => {
  const formattedTitle = formatTitle(props.title)
  const newProps: UseRfcEditorProps = { ...props, title: formattedTitle }

  useHead({
    title: formattedTitle,
    meta: [
      ...buildGeneric(newProps),
      ...buildOpenGraph(newProps),
      ...buildTwitter(newProps)
    ],
    link: [{ rel: 'canonical', href: props.canonicalUrl }]
  })
}

const formatTitle = (title?: string) => {
  if (!title) {
    return SITE_NAME
  }
  return `${title} | ${SITE_NAME}`
}

const linkPreviewImageBuilder = (mode: 'opengraph' | 'twitter') => {
  const dimensions: Record<typeof mode, WidthHeight> = {
    opengraph: [1200, 630],
    twitter: [1200, 675]
  }
  const widthHeight = dimensions[mode]

  const url = linkPreviewImageUrlBuilder(widthHeight[0], widthHeight[1])

  return {
    url,
    widthHeight,
    mime: getMime(url)
  }
}

const getMime = (url: string) => {
  if (url.endsWith('.png')) {
    return 'image/png' as const
  }
  throw Error(`Unsupported image format from ${url}`)
}

type MetaTag = {
  property: string
  content: string
}

const buildOpenGraph = (props: UseRfcEditorProps) => {
  const linkPreviewImage = linkPreviewImageBuilder('opengraph')
  const metaTags: MetaTag[] = [
    {
      property: 'og:title',
      content: props.title
    },
    {
      property: 'og:url',
      content: props.canonicalUrl
    },
    {
      property: 'og:image',
      content: linkPreviewImage.url
    },
    {
      property: 'og:image:type',
      content: linkPreviewImage.mime
    },
    {
      property: 'og:image:width',
      content: linkPreviewImage.widthHeight[0].toString()
    },
    {
      property: 'og:image:height',
      content: linkPreviewImage.widthHeight[1].toString()
    },
    {
      property: 'og:type',
      content: 'article'
    }
  ]

  if (props.authors) {
    metaTags.push({
      property: 'og:author',
      content: props.authors
    })
  }

  if (props.description) {
    metaTags.push({
      property: 'og:description',
      content: props.description
    })
  }

  return metaTags
}

const buildTwitter = (props: UseRfcEditorProps) => {
  const linkPreviewImage = linkPreviewImageBuilder('twitter')
  const metaTags: MetaTag[] = [
    {
      property: 'twitter:title',
      content: props.title
    },
    {
      property: 'twitter:image',
      content: linkPreviewImage.url
    },
    {
      property: 'twitter:image:alt',
      content: IMAGE_PREVIEW_ALT_TEXT
    },
    {
      property: 'twitter:image:width',
      content: linkPreviewImage.widthHeight[0].toString()
    },
    {
      property: 'twitter:image:height',
      content: linkPreviewImage.widthHeight[1].toString()
    }
  ]

  if (props.description) {
    metaTags.push({
      property: 'twitter:description',
      content: props.description
    })
  }

  return metaTags
}

const buildGeneric = (props: UseRfcEditorProps) => {
  const linkPreviewImage = linkPreviewImageBuilder('twitter')

  const metaTags: MetaTag[] = []

  if (props.authors) {
    metaTags.push({
      property: 'authors',
      content: props.authors
    })
  }

  if (props.description) {
    metaTags.push({
      property: 'twitter:description',
      content: props.description
    })
  }

  return metaTags
}

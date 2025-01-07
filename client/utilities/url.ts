import { parseRFCId } from '~/components/rfc'
import type { Rfc } from '~/generated/red-client'

export const PRIVATE_API_URL = 'http://localhost:8000/'

export const SEARCH_PATH = '/search/' as const

export const SEARCH_API_PATH = '/api/search/' as const

export const rfcPathBuilder = (rfc: string) => {
  const rfcParts = parseRFCId(rfc)

  return `/info/${rfcParts.type.toLowerCase()}${rfcParts.number}/`
}

export const rfcCitePathBuilder = (
  rfcId: string,
  format: 'txt' | 'bibTeX' | 'xml'
): string => {
  const parsedRfcId = parseRFCId(rfcId)

  switch (format) {
    case 'txt':
      return `https://www.rfc-editor.org/refs/${parsedRfcId.type.toLowerCase()}${parsedRfcId.number}.txt`
    case 'xml':
      return `https://bib.ietf.org/public/rfc/bibxml/reference.${parsedRfcId.type.toUpperCase()}.${parsedRfcId.number}.xml`
    case 'bibTeX':
      return `https://datatracker.ietf.org/doc/${parsedRfcId.type.toLowerCase()}${parsedRfcId.number}/bibtex/`
  }
}

export const rfcFormatPathBuilder = (rfcId: string, format: 'html'): string => {
  const parsedRfcId = parseRFCId(rfcId)

  switch (format) {
    case 'html':
      return `https://www.rfc-editor.org/rfc/${parsedRfcId.type.toLowerCase()}${parsedRfcId.number}.html`
  }
}

export const authorPathBuilder = (author: Rfc['authors'][number]): string => {
  return `mailto:${author.email}`
}

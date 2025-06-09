import { z } from 'zod'
import type { Rfc } from '../generated/red-client'

export type TypeSenseClient = {
  clearCache: () => void
  search: (searchRequests: Array<TypeSenseSearchRequest>) => void
  searchForFacetValues: (searchRequests: Array<TypeSenseSearchRequest>) => void
}

export type TypeSenseSearchRequest = {
  indexName: string
  params: {
    query: string
    facets?: string[]
    facetFilters?: string[]
  }
}

export type TypeSenseSearchItem = z.infer<typeof TypeSenseSearchItemSchema>

// Schema definition https://github.com/ietf-tools/search/blob/main/schemas/docs.md
export const TypeSenseSearchItemSchema = z.object({
  id: z.string(),
  abstract: z.string(),
  adName: z.string().optional(),
  rfc: z.string(),
  rfcNumber: z.number(),
  filename: z.string(),
  title: z.string(),
  stdlevelname: z.string(),
  type: z.string(),
  date: z.number(),
  pages: z.number(),
  stream: z.string(),
  keywords: z.array(z.string()),
  state: z.array(z.string()),
  authors: z
    .array(
      z.object({
        name: z.string(),
        affiliation: z.string()
      })
    )
    .optional(),
  publicationDate: z.number(),
  ranking: z.number(),
  group: z.object({
    acronym: z.string(),
    name: z.string(),
    full: z.string()
  }),
  area: z
    .object({
      acronym: z.string(),
      name: z.string(),
      full: z.string()
    })
    .optional()
})

export const typeSenseSearchItemToRFC = (
  typeSenseSearchItem: TypeSenseSearchItem
): Rfc => {
  const result = TypeSenseSearchItemSchema.safeParse(typeSenseSearchItem)
  if (result.error) {
    console.error(result.error.toString())
    throw Error(result.error.toString())
  }

  const item = result.data

  return {
    number: item.rfcNumber,
    title: item.title,
    published: new Date(item.publicationDate * 1000).toISOString(),
    authors:
      item.authors?.map((author, index) => ({
        person: index,
        name: author.name
      })) ?? [],
    area:
      item.area ?
        {
          name: item.area.name,
          acronym: item.area.acronym
        }
      : undefined,
    group: {
      name: item.group.name,
      acronym: item.group.acronym
    },
    abstract: item.abstract,
    status: {
      slug: 'unknown',
      name: item.stdlevelname
    },
    formats: [],
    stream: {
      slug: 'unknown',
      name: item.stdlevelname
    },
    text: ''
  }
}

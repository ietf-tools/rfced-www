import { z } from 'zod'
import type { Rfc } from '../generated/red-client'

export type TypeSenseSearchItem = z.infer<typeof TypeSenseSearchItemSchema>

// Schema definition https://github.com/ietf-tools/search/blob/main/schemas/docs.md
export const TypeSenseSearchItemSchema = z.object({
  objectID: z.string(),
  rfc: z.string(),
  rfcNumber: z.number(),
  filename: z.string(),
  title: z.string(),
  stdlevelname: z.string(),
  abstract: z.string(),
  authors: z
    .array(
      z.object({
        name: z.string()
      })
    )
    .optional(),
  publicationDate: z.number(),
  group: z.object({
    acronym: z.string(),
    name: z.string()
  }),
  area: z.object({
    acronym: z.string(),
    name: z.string()
  }).optional()
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
    published: new Date(item.publicationDate).toISOString(),
    authors:
      item.authors?.map((author, index) => ({
        person: index,
        name: author.name
      })) ?? [],
    area: item.area,
    group: item.group,
    abstract: item.abstract,
    status: {
      slug: 'unknown',
      name: ''
    },
    formats: [],
    stream: {
      slug: 'unknown',
      name: ''
    },
    text: ''
  }
}

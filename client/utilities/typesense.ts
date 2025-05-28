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
  group: z.string(), // slug
  groupName: z.string(), // name
  area: z.string().optional(), // slug
  areaName: z.string().optional() // name
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
    area:
      item.area && item.areaName ?
        {
          acronym: item.area,
          name: item.areaName
        }
      : undefined,
    group: {
      acronym: item.group,
      name: item.groupName
    },
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

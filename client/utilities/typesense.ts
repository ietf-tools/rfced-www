import type { Rfc } from '../generated/red-client'
import { z } from 'zod'

export type TypeSenseSearchItem = z.infer<typeof TypeSenseSearchItemSchema>

export const TypeSenseSearchItemSchema = z.object({
  objectID: z.string(),
  rfc: z.string(),
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
  groupName: z.string(),
  areaName: z.string().optional()
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
    number: parseInt(item.rfc, 10),
    title: item.title,
    published: new Date(item.publicationDate).toUTCString(),
    authors:
      item.authors?.map((author, index) => ({
        person: index,
        name: author.name
      })) ?? [],
    area:
      item.areaName ?
        {
          acronym: item.areaName,
          name: item.areaName
        }
      : undefined,
    group: {
      acronym: item.groupName,
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

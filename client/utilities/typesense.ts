import type { Rfc } from '../generated/red-client'

export type TypeSenseSearchItem = {
  objectID: string
  rfc: string
  filename: string
  title: string
  stdlevelname: string
  abstract: string
  authors: { name: string }[]
  publicationDate: number
  groupName: string
  areaName: string
}

export const typeSenseSearchItemToRFC = (
  typeSenseSearchItem: TypeSenseSearchItem
): Rfc => {
  return {
    number: parseInt(typeSenseSearchItem.rfc, 10),
    title: typeSenseSearchItem.title,
    published: new Date(typeSenseSearchItem.publicationDate).toUTCString(),
    authors: typeSenseSearchItem.authors.map((author, index) => ({
      person: index,
      name: author.name
    })),
    area: {
      acronym: typeSenseSearchItem.areaName,
      name: typeSenseSearchItem.areaName
    },
    group: {
      acronym: typeSenseSearchItem.groupName,
      name: typeSenseSearchItem.groupName
    },
    abstract: typeSenseSearchItem.abstract,
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

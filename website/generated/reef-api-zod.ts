// @ts-nocheck
import type * as __TypedOpenapi from './reef-api-zod.types.js'

import { z } from 'zod'

// <Schemas>
export type DigestPreference = __TypedOpenapi.Schemas.DigestPreference
export const DigestPreference = z.strictObject({ receive_digest_email: z.boolean() }).partial()

export type DocumentAreaOrGroup = __TypedOpenapi.Schemas.DocumentAreaOrGroup
export const DocumentAreaOrGroup = z.strictObject({ acronym: z.string(), name: z.string() })

export type DocumentIdentifier = __TypedOpenapi.Schemas.DocumentIdentifier
export const DocumentIdentifier = z.strictObject({ type: z.string(), value: z.string() })

export type DocumentMetadata = __TypedOpenapi.Schemas.DocumentMetadata
export const DocumentMetadata = z.strictObject({ title: z.string().nullable(), subseries: z.array(z.string()) })

export type DocumentSetEntry = __TypedOpenapi.Schemas.DocumentSetEntry
export const DocumentSetEntry = z.strictObject({ doc: z.string(), rank: z.number().int(), added_at: z.iso.datetime() })

export type DocumentSet = __TypedOpenapi.Schemas.DocumentSet
export const DocumentSet = z.strictObject({
  id: z.uuid(),
  title: z.string().max(200),
  description: z.string().max(1000).optional(),
  documents: z.array(DocumentSetEntry),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime()
})

export type DocumentSetOrder = __TypedOpenapi.Schemas.DocumentSetOrder
export const DocumentSetOrder = z.strictObject({ documents: z.array(z.string()) })

export type DocumentStats = __TypedOpenapi.Schemas.DocumentStats
export const DocumentStats = z.strictObject({
  doc: z.string(),
  rating_average: z.number().nullable(),
  rating_count: z.number().int(),
  subscriber_count: z.number().int(),
  set_count: z.number().int()
})

export type FullDocumentMetadata = __TypedOpenapi.Schemas.FullDocumentMetadata
export const FullDocumentMetadata = z.strictObject({
  title: z.string().nullable(),
  subseries: z.array(z.string()),
  status: z.string().nullable(),
  status_name: z.string().nullable(),
  stream: z.string().nullable(),
  stream_name: z.string().nullable(),
  obsoletes: z.array(z.number().int()),
  obsoleted_by: z.array(z.number().int()),
  updates: z.array(z.number().int()),
  updated_by: z.array(z.number().int()),
  authors: z.array(z.string()),
  published: z.string().nullable(),
  identifiers: z.array(DocumentIdentifier),
  area: DocumentAreaOrGroup.nullable(),
  group: DocumentAreaOrGroup.nullable(),
  keywords: z.array(z.string()),
  pages: z.number().int().nullable(),
  abstract: z.string().nullable()
})

export type KindEnum = __TypedOpenapi.Schemas.KindEnum
export const KindEnum = z.enum(['new_rfc', 'by_status', 'obsoleted', 'rfc', 'set', 'subject'])

export type MinimalSubject = __TypedOpenapi.Schemas.MinimalSubject
export const MinimalSubject = z.strictObject({
  slug: z.string().regex(new RegExp('^[-a-zA-Z0-9_]+$')),
  name: z.string(),
  path: z.string()
})

export type MyDocument = __TypedOpenapi.Schemas.MyDocument
export const MyDocument = z.strictObject({
  doc: z.string(),
  your_rating: z.number().int().nullable(),
  your_subscription_id: z.number().int().nullable(),
  your_set_ids: z.array(z.uuid())
})

export type MyDocumentSet = __TypedOpenapi.Schemas.MyDocumentSet
export const MyDocumentSet = z.strictObject({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime()
})

export type MyDocuments = __TypedOpenapi.Schemas.MyDocuments
export const MyDocuments = z.strictObject({ sets: z.array(MyDocumentSet), documents: z.array(MyDocument) })

export type MyRating = __TypedOpenapi.Schemas.MyRating
export const MyRating = z.strictObject({ doc: z.string(), value: z.number().int(), updated_at: z.iso.datetime() })

export type VisibilityEnum = __TypedOpenapi.Schemas.VisibilityEnum
export const VisibilityEnum = z.enum(['open', 'authenticated'])

export type OpenSurvey = __TypedOpenapi.Schemas.OpenSurvey
export const OpenSurvey = z.strictObject({
  id: z.number().int(),
  slug: z.string().max(100).regex(new RegExp('^[-a-zA-Z0-9_]+$')),
  title: z.string().max(255),
  description: z.string().optional(),
  url: z.string(),
  documents: z.array(z.string()).nullable(),
  visibility: VisibilityEnum.optional(),
  answered: z.boolean()
})

export type WebNotification = __TypedOpenapi.Schemas.WebNotification
export const WebNotification = z.strictObject({
  id: z.number().int(),
  kind: z.string(),
  event: z
    .object({ rfc: z.object({ number: z.number().int() }).catchall(z.unknown()) })
    .partial()
    .catchall(z.unknown()),
  read: z.boolean(),
  created_at: z.iso.datetime()
})

export type PaginatedWebNotificationList = __TypedOpenapi.Schemas.PaginatedWebNotificationList
export const PaginatedWebNotificationList = z.strictObject({
  next: z.url().nullable().optional(),
  previous: z.url().nullable().optional(),
  results: z.array(WebNotification)
})

export type PatchedDigestPreference = __TypedOpenapi.Schemas.PatchedDigestPreference
export const PatchedDigestPreference = z.strictObject({ receive_digest_email: z.boolean() }).partial()

export type PatchedDocumentSet = __TypedOpenapi.Schemas.PatchedDocumentSet
export const PatchedDocumentSet = z
  .strictObject({
    id: z.uuid(),
    title: z.string().max(200),
    description: z.string().max(1000),
    documents: z.array(DocumentSetEntry),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime()
  })
  .partial()

export type StatusEnum = __TypedOpenapi.Schemas.StatusEnum
export const StatusEnum = z.enum(['draft', 'published', 'closed'])

export type PatchedSurvey = __TypedOpenapi.Schemas.PatchedSurvey
export const PatchedSurvey = z
  .strictObject({
    id: z.number().int(),
    slug: z.string().max(100).regex(new RegExp('^[-a-zA-Z0-9_]+$')),
    title: z.string().max(255),
    description: z.string(),
    definition: z.unknown(),
    theme: z.null(),
    status: StatusEnum,
    visibility: VisibilityEnum,
    audience: z.null(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime()
  })
  .partial()

export type PopularityEntry = __TypedOpenapi.Schemas.PopularityEntry
export const PopularityEntry = z.strictObject({ rfc: z.string().max(32), popularity: z.number().min(0).max(1) })

export type Popularity = __TypedOpenapi.Schemas.Popularity
export const Popularity = z.strictObject({
  computed_at: z.iso.datetime().nullable(),
  entries: z.array(PopularityEntry)
})

export type SubjectAncestor = __TypedOpenapi.Schemas.SubjectAncestor
export const SubjectAncestor = z.strictObject({
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  document_count: z.number().int(),
  document_count_deep: z.number().int()
})

export type SubjectBranchNode = __TypedOpenapi.Schemas.SubjectBranchNode
export const SubjectBranchNode = z.lazy(() =>
  z.strictObject({
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    document_count: z.number().int(),
    document_count_deep: z.number().int(),
    children: z.array(SubjectBranchNode)
  })
)

export type SubjectMeta = __TypedOpenapi.Schemas.SubjectMeta
export const SubjectMeta = z.strictObject({
  ancestors: z.array(SubjectAncestor),
  descendants: z.array(SubjectBranchNode)
})

export type PrecomputedSubjectDetail = __TypedOpenapi.Schemas.PrecomputedSubjectDetail
export const PrecomputedSubjectDetail = z.strictObject({
  id: z.number().int(),
  slug: z.string().regex(new RegExp('^[-a-zA-Z0-9_]+$')),
  name: z.string(),
  description: z.string(),
  parent: z.string().nullable(),
  path: z.string(),
  document_count: z.number().int(),
  document_count_deep: z.number().int(),
  retired: z.boolean(),
  children: z.array(z.string()),
  aliases: z.array(z.string()),
  documents: z.array(z.string()),
  document_meta: z.record(z.string(), FullDocumentMetadata),
  subject_meta: SubjectMeta
})

export type RetiredSubject = __TypedOpenapi.Schemas.RetiredSubject
export const RetiredSubject = z.strictObject({
  slug: z.string().regex(new RegExp('^[-a-zA-Z0-9_]+$')),
  retired: z.boolean(),
  merged_into: z.string()
})

export type SubjectAlias = __TypedOpenapi.Schemas.SubjectAlias
export const SubjectAlias = z.strictObject({
  slug: z.string().regex(new RegExp('^[-a-zA-Z0-9_]+$')),
  alias_of: z.string()
})

export type PrecomputedSubjectDetailOrRedirect = __TypedOpenapi.Schemas.PrecomputedSubjectDetailOrRedirect
export const PrecomputedSubjectDetailOrRedirect = z
  .union([PrecomputedSubjectDetail, RetiredSubject, SubjectAlias])
  .refine(
    (data) =>
      [
        PrecomputedSubjectDetail.safeParse(data).success,
        RetiredSubject.safeParse(data).success,
        SubjectAlias.safeParse(data).success
      ].filter(Boolean).length === 1,
    { message: 'oneOf' }
  )

export type RatingAggregate = __TypedOpenapi.Schemas.RatingAggregate
export const RatingAggregate = z.strictObject({
  rfc: z.string(),
  average: z.number().nullable(),
  count: z.number().int(),
  your_rating: z.number().int().nullable()
})

export type RatingWrite = __TypedOpenapi.Schemas.RatingWrite
export const RatingWrite = z.strictObject({ value: z.number().int().min(1).max(5) })

export type ResponseCreate = __TypedOpenapi.Schemas.ResponseCreate
export const ResponseCreate = z
  .strictObject({
    data: z.unknown(),
    duration_seconds: z.number().int().min(0).max(2592000),
    pages_viewed: z.number().int().min(0).max(10000)
  })
  .partial()

export type Subject = __TypedOpenapi.Schemas.Subject
export const Subject = z.strictObject({
  id: z.number().int(),
  slug: z.string().regex(new RegExp('^[-a-zA-Z0-9_]+$')),
  name: z.string(),
  description: z.string(),
  parent: z.string().nullable(),
  path: z.string(),
  document_count: z.number().int(),
  document_count_deep: z.number().int()
})

export type SubjectDetail = __TypedOpenapi.Schemas.SubjectDetail
export const SubjectDetail = z.strictObject({
  id: z.number().int(),
  slug: z.string().regex(new RegExp('^[-a-zA-Z0-9_]+$')),
  name: z.string(),
  description: z.string(),
  parent: z.string().nullable(),
  path: z.string(),
  document_count: z.number().int(),
  document_count_deep: z.number().int(),
  retired: z.boolean(),
  children: z.array(z.string()),
  aliases: z.array(z.string()),
  documents: z.array(z.string())
})

export type SubjectDetailOrRedirect = __TypedOpenapi.Schemas.SubjectDetailOrRedirect
export const SubjectDetailOrRedirect = z
  .union([SubjectDetail, RetiredSubject, SubjectAlias])
  .refine(
    (data) =>
      [
        SubjectDetail.safeParse(data).success,
        RetiredSubject.safeParse(data).success,
        SubjectAlias.safeParse(data).success
      ].filter(Boolean).length === 1,
    { message: 'oneOf' }
  )

export type SubjectIndexEntry = __TypedOpenapi.Schemas.SubjectIndexEntry
export const SubjectIndexEntry = z.strictObject({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  parent: z.string().nullable(),
  path: z.string(),
  children: z.array(z.string()),
  documents: z.array(z.string()),
  document_count: z.number().int(),
  document_count_deep: z.number().int()
})

export type SubjectIndex = __TypedOpenapi.Schemas.SubjectIndex
export const SubjectIndex = z.strictObject({
  documents: z.record(z.string(), DocumentMetadata),
  subjects: z.record(z.string(), SubjectIndexEntry)
})

export type Subscription = __TypedOpenapi.Schemas.Subscription
export const Subscription = z.strictObject({
  id: z.number().int(),
  kind: KindEnum,
  params: z.unknown().optional(),
  set: z.uuid().nullable().optional(),
  subject: z.number().int().nullable().optional(),
  subject_details: MinimalSubject,
  created_at: z.iso.datetime()
})

export type Survey = __TypedOpenapi.Schemas.Survey
export const Survey = z.strictObject({
  id: z.number().int(),
  slug: z.string().max(100).regex(new RegExp('^[-a-zA-Z0-9_]+$')),
  title: z.string().max(255),
  description: z.string().optional(),
  definition: z.unknown().optional(),
  theme: z.null().optional(),
  status: StatusEnum.optional(),
  visibility: VisibilityEnum.optional(),
  audience: z.null().optional(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime()
})

export type SurveyDefinition = __TypedOpenapi.Schemas.SurveyDefinition
export const SurveyDefinition = z.strictObject({
  slug: z.string().max(100).regex(new RegExp('^[-a-zA-Z0-9_]+$')),
  title: z.string().max(255),
  description: z.string().optional(),
  definition: z.unknown().optional(),
  theme: z.null().optional(),
  visibility: VisibilityEnum.optional()
})

// </Schemas>

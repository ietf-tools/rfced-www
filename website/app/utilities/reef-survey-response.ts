import { getPagesViewed } from '~/utilities/pages-viewed'
import { createSurveyResponse } from '~/utilities/reef'

// Reef's upper bound for duration_seconds (see ResponseCreate in reef_api.yaml).
const MAX_DURATION_SECONDS = 2_592_000

export const secondsSince = (startedAtMs: number, nowMs: number): number =>
  Math.min(Math.max(Math.floor((nowMs - startedAtMs) / 1000), 0), MAX_DURATION_SECONDS)

export const submitSurveyResponse = async (
  slug: string,
  data: Record<string, unknown>,
  { durationSeconds }: { durationSeconds: number }
) => {
  await createSurveyResponse(slug, {
    data,
    duration_seconds: durationSeconds,
    pages_viewed: getPagesViewed()
  })
}

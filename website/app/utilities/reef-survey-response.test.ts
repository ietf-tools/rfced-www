import { beforeEach, describe, expect, test, vi } from 'vitest'

import { recordNavigation, resetPagesViewed } from './pages-viewed'
import { secondsSince, submitSurveyResponse } from './reef-survey-response'

const reef = vi.hoisted(() => ({ createSurveyResponse: vi.fn() }))

vi.mock('~/utilities/reef', () => reef)

describe('submitSurveyResponse', () => {
  beforeEach(() => {
    resetPagesViewed()
    reef.createSurveyResponse.mockReset()
  })

  test('sends the answers with the time taken and pages viewed', async () => {
    recordNavigation('/a/', undefined)
    recordNavigation('/survey/', '/a/')
    await submitSurveyResponse('s', { q: 1 }, { durationSeconds: 42 })
    expect(reef.createSurveyResponse).toHaveBeenCalledWith('s', {
      data: { q: 1 },
      duration_seconds: 42,
      pages_viewed: 2
    })
  })

  test('leaves pages_viewed out when no navigation was counted', async () => {
    await submitSurveyResponse('s', {}, { durationSeconds: 1 })
    expect(reef.createSurveyResponse).toHaveBeenCalledWith('s', {
      data: {},
      duration_seconds: 1,
      pages_viewed: undefined
    })
  })
})

describe('secondsSince', () => {
  test('rounds down to whole seconds', () => {
    expect(secondsSince(1000, 3999)).toBe(2)
  })

  test('is never negative', () => {
    expect(secondsSince(5000, 1000)).toBe(0)
  })

  test('stops at the most Reef accepts', () => {
    expect(secondsSince(0, 3_000_000_000)).toBe(2_592_000)
  })
})

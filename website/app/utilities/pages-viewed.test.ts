import { beforeEach, describe, expect, test } from 'vitest'

import { getPagesViewed, recordNavigation, resetPagesViewed } from './pages-viewed'

describe('pages viewed', () => {
  beforeEach(resetPagesViewed)

  test('is undefined until a navigation is recorded', () => {
    expect(getPagesViewed()).toBeUndefined()
  })

  test('counts the landing page', () => {
    recordNavigation('/info/rfc9000/', undefined)
    expect(getPagesViewed()).toBe(1)
  })

  test('counts each change of path, back and forward included', () => {
    recordNavigation('/a/', undefined)
    recordNavigation('/b/', '/a/')
    recordNavigation('/a/', '/b/')
    expect(getPagesViewed()).toBe(3)
  })

  test('ignores navigation that stays on the same path', () => {
    recordNavigation('/a/', undefined)
    recordNavigation('/a/', '/a/')
    expect(getPagesViewed()).toBe(1)
  })

  test('stops at the most Reef accepts', () => {
    for (let i = 0; i < 10_050; i += 1) {
      recordNavigation(`/${i}/`, undefined)
    }
    expect(getPagesViewed()).toBe(10_000)
  })
})

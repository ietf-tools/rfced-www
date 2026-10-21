// @vitest-environment nuxt
import { defineComponent } from 'vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { enableAutoUnmount } from '@vue/test-utils'

import { useUserRFCRating } from './reef-ratings'
import { useAuthStore } from '~/stores/auth'
import { useNotificationsStore } from '~/stores/notifications'
import { useReefStore } from '~/stores/reef'

const reef = vi.hoisted(() => ({
  getMyRatings: vi.fn(),
  getSubscriptions: vi.fn(),
  getSets: vi.fn(),
  putRating: vi.fn(),
  deleteRating: vi.fn()
}))

vi.mock('~/utilities/reef', async (importOriginal) => ({
  ...(await importOriginal<typeof import('~/utilities/reef')>()),
  ...reef
}))

const RatingHarness = defineComponent({
  setup: () => useUserRFCRating(9110)
})

const signedInRating = async (rating?: number) => {
  reef.getMyRatings.mockResolvedValue(rating === undefined ? [] : [{ doc: 'rfc9110', value: rating }])
  useAuthStore().setUser({ sub: 'reader-1' })
  await vi.waitFor(() => expect(useReefStore().status.ratings.type).toBe('success'))
}

describe('useUserRFCRating', () => {
  enableAutoUnmount(afterEach)

  beforeEach(() => {
    Object.values(reef).forEach((fn) => fn.mockReset())
    reef.getSubscriptions.mockResolvedValue([])
    reef.getSets.mockResolvedValue([])
    vi.spyOn(console, 'error').mockImplementation(() => {})
    useAuthStore().clearUser()
    useNotificationsStore().queue = []
  })

  test('syncStatus follows a save: loading while it is in flight, then success', async () => {
    await signedInRating()
    let confirm: (value: unknown) => void = () => {}
    reef.putRating.mockReturnValue(new Promise((resolve) => (confirm = resolve)))
    const harness = await mountSuspended(RatingHarness)
    expect(harness.vm.syncStatus).toEqual({ type: 'idle' })

    harness.vm.rating = 4
    expect(harness.vm.syncStatus).toEqual({ type: 'loading' })
    expect(harness.vm.rating).toBe(4)

    confirm(undefined)
    await vi.waitFor(() => expect(harness.vm.syncStatus).toEqual({ type: 'success' }))
  })

  test('syncStatus reports a refused rating, the stars go back, and retry repeats it', async () => {
    await signedInRating(2)
    reef.putRating.mockRejectedValueOnce(new Error('nope'))
    const harness = await mountSuspended(RatingHarness)

    harness.vm.rating = 5
    await vi.waitFor(() => expect(harness.vm.syncStatus.type).toBe('error'))
    expect(harness.vm.syncStatus).toEqual({
      type: 'error',
      message: 'Your rating of RFC 9110 has not been saved. Please try again.'
    })
    expect(harness.vm.rating).toBe(2)

    reef.putRating.mockResolvedValue(undefined)
    harness.vm.retry()
    await vi.waitFor(() => expect(harness.vm.syncStatus).toEqual({ type: 'success' }))
    expect(harness.vm.rating).toBe(5)
    expect(reef.putRating).toHaveBeenLastCalledWith('rfc9110', { value: 5 })
  })

  test('a refused removal is retried as a removal', async () => {
    await signedInRating(3)
    reef.deleteRating.mockRejectedValueOnce(new Error('nope'))
    const harness = await mountSuspended(RatingHarness)

    harness.vm.rating = undefined
    await vi.waitFor(() => expect(harness.vm.syncStatus.type).toBe('error'))
    expect(harness.vm.rating).toBe(3)

    reef.deleteRating.mockResolvedValue(undefined)
    harness.vm.retry()
    await vi.waitFor(() => expect(harness.vm.syncStatus).toEqual({ type: 'success' }))
    expect(harness.vm.rating).toBeUndefined()
    expect(reef.deleteRating).toHaveBeenCalledTimes(2)
  })

  test('syncStatus is the load while that has failed, and retry reloads', async () => {
    reef.getMyRatings.mockRejectedValueOnce(new Error('down'))
    useAuthStore().setUser({ sub: 'reader-1' })
    const harness = await mountSuspended(RatingHarness)
    await vi.waitFor(() => expect(harness.vm.syncStatus.type).toBe('error'))

    reef.getMyRatings.mockResolvedValue([])
    harness.vm.retry()
    await vi.waitFor(() => expect(useReefStore().status.ratings).toEqual({ type: 'success' }))
    expect(reef.getMyRatings).toHaveBeenCalledTimes(2)
  })
})

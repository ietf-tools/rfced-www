// @vitest-environment nuxt
//
// The async status message: it shows the caller's wording for each status, and stays quiet when it
// mounts already settled.
import { afterEach, describe, expect, test, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { enableAutoUnmount } from '@vue/test-utils'
import AsyncStatusMessage from './AsyncStatusMessage.vue'
import { MIN_LOADING_VISIBLE_MS, SUCCESS_VISIBLE_MS } from '~/utilities/async-status-icon'
import type { LoadingStatus } from '~/utilities/loading-status'

enableAutoUnmount(afterEach)

const messages = { loading: 'Saving...', success: 'Saved.' }

const render = (status: LoadingStatus) => mountSuspended(AsyncStatusMessage, { props: { status, messages } })

describe('AsyncStatusMessage', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  test('says nothing when it mounts already settled', async () => {
    const wrapper = await render({ type: 'success' })
    expect(wrapper.text()).toBe('')
  })

  test('shows the loading text, then the success text, then lets it go', async () => {
    vi.useFakeTimers()
    const wrapper = await render({ type: 'loading' })
    expect(wrapper.get('[role="status"]').text()).toBe(messages.loading)

    await vi.advanceTimersByTimeAsync(MIN_LOADING_VISIBLE_MS)
    await wrapper.setProps({ status: { type: 'success' } })
    expect(wrapper.get('[role="status"]').text()).toBe(messages.success)

    await vi.advanceTimersByTimeAsync(SUCCESS_VISIBLE_MS)
    expect(wrapper.get('[role="status"]').text()).toBe(messages.success)

    await vi.advanceTimersByTimeAsync(5000 - SUCCESS_VISIBLE_MS)
    expect(wrapper.text()).toBe('')
  })

  test('announces an error as an alert', async () => {
    const wrapper = await render({ type: 'error', message: 'Unable to save.' })
    expect(wrapper.get('[role="alert"]').text()).toBe('Unable to save.')
  })
})

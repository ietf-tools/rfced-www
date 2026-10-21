// @vitest-environment nuxt
//
// The async status icon: what it announces for each status, that it stays quiet when it mounts
// already settled, and that its error state is a labelled, focusable control.
import { afterEach, describe, expect, test, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { enableAutoUnmount } from '@vue/test-utils'
import AsyncStatusIcon from './AsyncStatusIcon.vue'
import { MIN_LOADING_VISIBLE_MS, SUCCESS_VISIBLE_MS } from '~/utilities/async-status-icon'
import type { LoadingStatus } from '~/utilities/loading-status'

enableAutoUnmount(afterEach)

const LABEL = 'your subscription'

const render = (status: LoadingStatus) => mountSuspended(AsyncStatusIcon, { props: { status, label: LABEL } })

describe('AsyncStatusIcon', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  test('says nothing when it mounts already settled', async () => {
    const wrapper = await render({ type: 'success' })
    expect(wrapper.get('[role="status"]').text()).toBe('')
    expect(wrapper.find('button').exists()).toBe(false)
  })

  test('announces the update, then completion', async () => {
    const wrapper = await render({ type: 'loading' })
    expect(wrapper.get('[role="status"]').text()).toBe(`Updating ${LABEL}.`)
    await wrapper.setProps({ status: { type: 'success' } })
    expect(wrapper.get('[role="status"]').text()).toBe(`Finished updating ${LABEL}.`)
  })

  test('holds the success tick, then lets it go', async () => {
    vi.useFakeTimers()
    const wrapper = await render({ type: 'loading' })
    await vi.advanceTimersByTimeAsync(MIN_LOADING_VISIBLE_MS)
    await wrapper.setProps({ status: { type: 'success' } })
    expect(wrapper.findComponent({ name: 'GraphicsCheckmark' }).exists()).toBe(true)
    await vi.advanceTimersByTimeAsync(SUCCESS_VISIBLE_MS)
    expect(wrapper.findComponent({ name: 'GraphicsCheckmark' }).exists()).toBe(false)
  })

  test('keeps the spinner up for the minimum time before showing the outcome', async () => {
    vi.useFakeTimers()
    const wrapper = await render({ type: 'loading' })
    await vi.advanceTimersByTimeAsync(200)
    await wrapper.setProps({ status: { type: 'error', message: 'Unable to save.' } })
    expect(wrapper.findComponent({ name: 'GraphicsLoading' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'GraphicsDismiss' }).exists()).toBe(false)
    expect(wrapper.find('button').exists()).toBe(false)

    await vi.advanceTimersByTimeAsync(MIN_LOADING_VISIBLE_MS - 200)
    expect(wrapper.findComponent({ name: 'GraphicsLoading' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'GraphicsDismiss' }).exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  test('an error is announced and offered as a labelled button', async () => {
    const wrapper = await render({ type: 'error', message: 'Unable to load.' })
    expect(wrapper.get('[role="alert"]').text()).toBe('Unable to load.')
    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe(`Problem updating ${LABEL}. Show details`)
    expect(button.attributes('aria-disabled')).toBe('false')
  })

  test('hides decorative icons from assistive technology', async () => {
    const wrapper = await render({ type: 'loading' })
    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('svg').element.closest('[aria-hidden="true"]')).not.toBeNull()
  })
})

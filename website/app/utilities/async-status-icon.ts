import type { LoadingStatus } from '~/utilities/loading-status'

export type AsyncStatusIconVisual = 'none' | 'loading' | 'success' | 'error'

export const SUCCESS_VISIBLE_MS = 2000
export const MIN_LOADING_VISIBLE_MS = 1000

/**
 * What an async status icon shows and says for a `LoadingStatus`.
 *
 * Success is only shown, and only announced, once a load has been seen in flight: an icon that
 * mounts after the load already settled would otherwise celebrate something the reader never saw
 * pending. `successVisibleMs` overrides how long the success state is held, for callers whose
 * success needs reading rather than glancing at. The spinner stays up for at least `MIN_LOADING_VISIBLE_MS`, so a save that answers at
 * once still reads as having happened rather than flickering past. The tick then fades after `SUCCESS_VISIBLE_MS` because success is the steady state and
 * shouldn't hold space in the UI forever.
 *
 * `isRetrying` is true from `retry()` until the spinner has gone, so the icon's retry control can
 * stay in the page (and keep focus) while the retried load is in flight.
 */
export const useAsyncStatusIcon = (
  status: MaybeRefOrGetter<LoadingStatus>,
  label: MaybeRefOrGetter<string>,
  { successVisibleMs = SUCCESS_VISIBLE_MS }: { successVisibleMs?: number } = {}
) => {
  const hasSeenLoading = ref(false)
  const isSuccessShown = ref(false)
  const isRetrying = ref(false)
  const isLoadingHeld = ref(false)
  let loadingStartedAt = 0
  let successTimer: ReturnType<typeof setTimeout> | undefined
  let holdTimer: ReturnType<typeof setTimeout> | undefined

  const clearTimers = () => {
    clearTimeout(successTimer)
    clearTimeout(holdTimer)
    successTimer = undefined
    holdTimer = undefined
  }

  watch(
    () => toValue(status).type,
    (type, previousType) => {
      clearTimers()
      isSuccessShown.value = false
      isLoadingHeld.value = false

      if (type === 'loading') {
        hasSeenLoading.value = true
        loadingStartedAt = Date.now()
        return
      }

      const settle = () => {
        isLoadingHeld.value = false
        isRetrying.value = false
        if (type === 'success' && hasSeenLoading.value) {
          isSuccessShown.value = true
          successTimer = setTimeout(() => {
            isSuccessShown.value = false
          }, successVisibleMs)
        }
      }

      const remainingMs = previousType === 'loading' ? MIN_LOADING_VISIBLE_MS - (Date.now() - loadingStartedAt) : 0
      if (remainingMs > 0) {
        isLoadingHeld.value = true
        holdTimer = setTimeout(settle, remainingMs)
        return
      }
      settle()
    },
    { immediate: true }
  )

  onScopeDispose(clearTimers)

  const visual = computed<AsyncStatusIconVisual>(() => {
    if (isLoadingHeld.value) {
      return 'loading'
    }
    const { type } = toValue(status)
    if (type === 'loading' || type === 'error') {
      return type
    }
    return type === 'success' && isSuccessShown.value ? 'success' : 'none'
  })

  const progressAnnouncement = computed(() => {
    const { type } = toValue(status)
    if (type === 'loading') {
      return `Updating ${toValue(label)}.`
    }
    return type === 'success' && hasSeenLoading.value ? `Finished updating ${toValue(label)}.` : ''
  })

  const errorAnnouncement = computed(() => {
    const current = toValue(status)
    return current.type === 'error' ? current.message : ''
  })

  const retry = () => {
    isRetrying.value = true
  }

  return { visual, progressAnnouncement, errorAnnouncement, isRetrying, retry }
}

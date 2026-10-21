// Rating feature logic: the star scale itself, writing the signed-in reader's own rating of a
// document back to Reef, and the model an RFC page binds its rating dialog to.
//
// Reading a rating happens in ~/stores/reef, along with every other per-reader answer, because
// they're all loaded together when the reader signs in. What's left here is what's particular to a rating: what a
// rating is, how it's worded, what happens when Reef refuses one, and how the public average
// moves when this reader changes theirs.

import { computed, ref, toValue, watch, type ComputedRef, type MaybeRefOrGetter, type WritableComputedRef } from 'vue'
import { useNotificationsStore, type Notification } from '~/stores/notifications'
import { useReefStore } from '~/stores/reef'
import { deleteRating, putRating } from '~/utilities/reef'
import type { LoadingStatus } from '~/utilities/loading-status'
import { reefDocumentKey, useReefDocument } from '~/utilities/reef-documents'

export const STAR_SCORE_LENGTH = 5

// A rating is a whole number of stars, 1..STAR_SCORE_LENGTH — see RatingWrite.value's minimum
// and maximum in reef_api.yaml. `undefined` means the user hasn't rated this RFC, which is a
// different thing from a zero rating: Reef has no such value. It also matches StarRating's
// defineModel<number>(), so a UserRFCRating can be bound straight to the component.
export type UserRFCRating = number | undefined

// Wording for the reader's own rating, used both as the dialog's live summary and as the trigger
// label. Spelled out rather than left to the stars alone, so it's available to a screen reader and
// so "not rated yet" is stated rather than implied by five empty outlines.
export const userRFCRatingLabel = (rating: UserRFCRating): string =>
  rating === undefined ? '' : `${rating} out of ${STAR_SCORE_LENGTH} stars`

// --- Announcements ----------------------------------------------------------------------
//
// Picking a star is announced by the live region inside the dialog, but a removal can't be:
// removing closes the dialog, which takes that live region out of the DOM before a reader hears
// anything from it. A toast outlives the dialog, so it's what reports the outcome — and `foreground`
// is what has a screen reader announce it, this being a direct result of pressing the button.

// One id per document, shared by both outcomes, so a retry replaces the previous message in place
// rather than stacking a second toast on top of it.
const ratingRemovalNotificationId = (doc: string): string => `rating-removal.${doc}`

export const ratingRemovedNotification = (rfcNumber: number): Notification => ({
  id: ratingRemovalNotificationId(reefDocumentKey(rfcNumber)),
  title: 'Rating removed',
  description: `Your rating of RFC ${rfcNumber} has been removed, and no longer counts towards the average.`,
  delayMs: 0,
  // Short: a confirmation of something the reader just did, with nothing in it to act on, and the
  // button behind it has already gone back to offering a rating. Nothing is lost by missing it.
  durationMs: 5_000,
  position: 'top',
  type: 'foreground'
})

const ratingRemovalFailedDescription = (rfcNumber: number): string =>
  `Your rating of RFC ${rfcNumber} is unchanged. Please try again.`

const ratingSaveFailedDescription = (rfcNumber: number): string =>
  `Your rating of RFC ${rfcNumber} has not been saved. Please try again.`

export const ratingRemovalFailedNotification = (rfcNumber: number): Notification => ({
  id: ratingRemovalNotificationId(reefDocumentKey(rfcNumber)),
  title: 'Unable to remove your rating',
  // Says what the reader is left with, because the stars have been put back and the wording has to
  // account for them reappearing.
  description: ratingRemovalFailedDescription(rfcNumber),
  delayMs: 0,
  // Left to the default duration rather than the confirmation's five seconds: this one asks the
  // reader to do something about it, so it wants longer on screen than a confirmation does.
  position: 'top',
  type: 'foreground'
})

/**
 * Record or withdraw this reader's rating of one document.
 *
 * The store is changed first and put back if Reef refuses, so the stars move when the reader
 * presses them rather than a round trip later.
 *
 * Resolves to `unchanged` when there was nothing to ask Reef for.
 */
export const writeUserRFCRating = async (
  rfcNumber: number,
  rating: UserRFCRating
): Promise<'saved' | 'failed' | 'unchanged'> => {
  const reefStore = useReefStore()
  const notificationsStore = useNotificationsStore()
  const doc = reefDocumentKey(rfcNumber)

  const previous = reefStore.ratings[doc]
  if (rating === previous) {
    return 'unchanged'
  }

  // undefined is the reader withdrawing their rating rather than any value to store, so it's the
  // one case that deletes instead of putting.
  const isRemoval = rating === undefined

  reefStore.setRating(doc, rating)

  const outcome = await reefStore.runWrite(`${doc}:rating`, () =>
    isRemoval ? deleteRating(doc) : putRating(doc, { value: rating })
  )

  if (outcome.status === 'failed') {
    // Put the rating back to what Reef is holding. For a removal the dialog has already closed and
    // the stars have emptied, so without the toast the only visible result would be them silently
    // reappearing.
    reefStore.setRating(doc, previous)
    if (isRemoval) {
      notificationsStore.add(ratingRemovalFailedNotification(rfcNumber))
      console.error('Unable to remove your rating for this RFC.', outcome.error)
      return 'failed'
    }
    // Leaves the stars back where they were. Worth surfacing to the reader eventually; for now
    // it's a console error rather than a silent divergence.
    console.error('Unable to save your rating for this RFC.', outcome.error)
    return 'failed'
  }

  if (isRemoval) {
    // Announced only once Reef has accepted it, and only for a removal: picking a star is
    // announced by the live region in the dialog, but the dialog closes on a removal, so this
    // toast is the only report the reader gets.
    notificationsStore.add(ratingRemovedNotification(rfcNumber))
  }
  return 'saved'
}

/**
 * This reader's own rating of one document, as a model for the rating dialog: read from the store,
 * and written back when they pick a star or remove it. `undefined` while they haven't rated it,
 * and while nobody is signed in.
 *
 * A writable computed rather than a ref with a watcher on it: the store already holds what Reef is
 * holding, so there is nothing to compare against to tell a load from a deliberate change, and a
 * load is not a change to this model at all.
 *
 * `syncStatus` is the whole round trip for an async status icon: the load while that is pending or
 * has failed, and after it the reader's own changes — loading while one is being saved, an error
 * if the latest was refused, success once it is kept. `retry` repeats whichever of the two failed.
 */
export const useUserRFCRating = (
  rfcNumber: MaybeRefOrGetter<number>
): { rating: WritableComputedRef<UserRFCRating>; syncStatus: ComputedRef<LoadingStatus>; retry: () => void } => {
  const reefStore = useReefStore()
  const { yourRating } = useReefDocument(rfcNumber)

  const inFlight = ref(0)
  // Wrapped, because a failed removal is a rating of `undefined`.
  const failedSave = ref<{ rating: UserRFCRating }>()
  const hasSaved = ref(false)
  // Only the latest change decides the outcome: an earlier one that fails after a later one was
  // started describes a state the reader has already moved on from.
  let latestSave = 0

  watch(
    () => toValue(rfcNumber),
    () => {
      failedSave.value = undefined
      hasSaved.value = false
    }
  )

  const save = async (rating: UserRFCRating): Promise<void> => {
    latestSave += 1
    const thisSave = latestSave
    failedSave.value = undefined
    inFlight.value += 1
    const outcome = await writeUserRFCRating(toValue(rfcNumber), rating)
    inFlight.value -= 1
    if (thisSave !== latestSave) {
      return
    }
    if (outcome === 'failed') {
      failedSave.value = { rating }
    } else if (outcome === 'saved') {
      hasSaved.value = true
    }
  }

  const saveStatus = computed<LoadingStatus>(() => {
    if (inFlight.value > 0) {
      return { type: 'loading' }
    }
    const failed = failedSave.value
    if (failed !== undefined) {
      const rfc = toValue(rfcNumber)
      return {
        type: 'error',
        message: failed.rating === undefined ? ratingRemovalFailedDescription(rfc) : ratingSaveFailedDescription(rfc)
      }
    }
    return hasSaved.value ? { type: 'success' } : { type: 'idle' }
  })

  const loadStatus = computed(() => reefStore.status.ratings)

  return {
    rating: computed({
      get: () => yourRating.value,
      set: (rating) => {
        void save(rating)
      }
    }),
    syncStatus: computed(() => (loadStatus.value.type === 'success' ? saveStatus.value : loadStatus.value)),
    retry: () => {
      if (loadStatus.value.type !== 'success') {
        void reefStore.load()
        return
      }
      const failed = failedSave.value
      if (failed !== undefined) {
        void save(failed.rating)
      }
    }
  }
}

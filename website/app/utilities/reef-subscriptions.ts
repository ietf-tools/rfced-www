// Feature logic for a user's notification subscriptions — the model each subscribe dialog binds to.
// The account page's own list and delete presentation lives in ~/components/AccountSubscriptions.vue,
// since nothing else needs it.
//
// Whether this reader subscribes to something is read from ~/stores/reef, which loads every
// subscription they have when they sign in. One composable serves every kind Red has a control for:
// a document (the `rfc` kind), all new RFCs (`new_rfc`) and a subject (`subject`).

import { computed, toValue, type ComputedRef, type MaybeRefOrGetter, type WritableComputedRef } from 'vue'
import { subscriptionKey, useReefStore, type SubscriptionTarget } from '~/stores/reef'
import { useNotificationsStore, type Notification } from '~/stores/notifications'
import type { LoadingStatus } from '~/utilities/loading-status'
import { createSubscription, deleteSubscription, type Subscription } from '~/utilities/reef'
import { reefDocumentKey } from '~/utilities/reef-documents'
import type { SeriesId } from '~/utilities/rfc'

// The spec types `params` as a free-form object, so the shape per kind isn't something the
// generated types can check. The `rfc` kind names its document under `rfc` — any canonical document
// id, so a BCP, STD or FYI subseries is subscribed to the same way as an RFC — and the `subject`
// kind names its subject by a foreign key on the subscription itself. This is the single place that
// knows how each is written.
const subscriptionBody = (target: SubscriptionTarget): Pick<Subscription, 'kind' | 'params' | 'subject'> => {
  switch (target.kind) {
    case 'new_rfc':
      return { kind: 'new_rfc' }
    case 'rfc':
      return { kind: 'rfc', params: { rfc: target.doc } }
    case 'subject':
      return { kind: 'subject', subject: target.subject }
  }
}

// --- Announcements ----------------------------------------------------------------------
//
// Only failures are announced here. A subscribe or unsubscribe that works needs no toast: the
// checkbox stays on screen with its state flipped, and a screen reader reads that from
// aria-checked. A failure is different — the checkbox is put back the way it was, so without this
// the only visible result of pressing it would be nothing happening.

export const documentLabel = (document: SeriesId | number): string =>
  typeof document === 'number' ? `RFC ${document}` : `${document.type.toUpperCase()} ${document.number}`

export const subscriptionFailedNotification = (
  target: SubscriptionTarget,
  label: string,
  wasSubscribing: boolean
): Notification => ({
  // One id per target whichever way the toggle was going, so a retry replaces the previous
  // message rather than stacking a second toast on top of it.
  id: `subscription.${subscriptionKey(target)}`,
  title: wasSubscribing ? 'Unable to subscribe' : 'Unable to unsubscribe',
  description: wasSubscribing
    ? `You have not been subscribed to ${label}. Please try again.`
    : `You are still subscribed to ${label}. Please try again.`,
  delayMs: 0,
  position: 'top',
  // A direct result of the reader pressing the checkbox, so it's announced rather than left to be
  // noticed.
  type: 'foreground'
})

/**
 * Subscribe this reader to one target, or unsubscribe them.
 *
 * The checkbox moves first, as a pending change in the store. Subscribing has no id until Reef
 * assigns one, which is why that change is held apart from the list: between the tick and the
 * response the reader is subscribed as far as the page is concerned, and unsubscribing is what
 * needs the id.
 *
 * What to create or delete is decided when the write runs rather than when it was asked for, so a
 * subscribe followed at once by an unsubscribe removes the subscription the first one made, and one
 * that failed leaves nothing for the second to remove. If Reef refuses, the pending change simply
 * ends and the list — which was never touched — is what shows again.
 */
export const writeUserSubscription = async (
  target: SubscriptionTarget,
  label: string,
  isSubscribed: boolean
): Promise<void> => {
  const reefStore = useReefStore()
  const notificationsStore = useNotificationsStore()
  const key = subscriptionKey(target)

  if (isSubscribed === reefStore.isSubscribedTo(key)) {
    return
  }

  // Whose subscription this is, so an answer that arrives after they have signed out isn't added
  // to the next reader's list.
  const { subject } = reefStore

  reefStore.beginSubscriptionChange(key, isSubscribed)

  const outcome = await reefStore.runWrite(`${key}:subscription`, async (): Promise<void> => {
    const existing = reefStore.subscriptionByKey.get(key)

    if (isSubscribed) {
      if (existing !== undefined) {
        return
      }
      // The id Reef assigns here is what unsubscribing needs, so the whole answer is kept.
      const created = await createSubscription(subscriptionBody(target))
      if (reefStore.subject === subject) {
        reefStore.addSubscription(created)
      }
      return
    }

    if (existing === undefined) {
      return
    }
    await deleteSubscription(existing.id)
    if (reefStore.subject === subject) {
      reefStore.removeSubscription(existing.id)
    }
  })

  reefStore.endSubscriptionChange(key)

  if (outcome.status === 'failed') {
    notificationsStore.add(subscriptionFailedNotification(target, label, isSubscribed))
    console.error('Unable to change your subscription.', outcome.error)
  }
}

/**
 * Whether this reader subscribes to one target, as a model for a subscribe dialog's checkbox: read
 * from the store, and written back when they tick or untick it. False while nobody is signed in.
 *
 * `label` names the target in the toast that reports a refusal.
 *
 * `status` is exposed alongside so the dialog can hold off showing the checkbox until the
 * subscriptions have arrived — an unticked box while they're still loading would read as "not
 * subscribed" rather than "not known yet".
 */
export const useUserSubscription = (
  target: MaybeRefOrGetter<SubscriptionTarget>,
  label: MaybeRefOrGetter<string>
): { isSubscribed: WritableComputedRef<boolean>; status: ComputedRef<LoadingStatus> } => {
  const reefStore = useReefStore()

  return {
    isSubscribed: computed({
      get: () => reefStore.isSubscribedTo(subscriptionKey(toValue(target))),
      set: (subscribed) => {
        void writeUserSubscription(toValue(target), toValue(label), subscribed)
      }
    }),
    status: computed(() => reefStore.status.subscriptions)
  }
}

/** `useUserSubscription` for one document: an RFC, or a BCP, STD or FYI subseries. */
export const useUserRFCSubscription = (document: MaybeRefOrGetter<SeriesId | number>) =>
  useUserSubscription(
    () => ({ kind: 'rfc', doc: reefDocumentKey(toValue(document)) }),
    () => documentLabel(toValue(document))
  )

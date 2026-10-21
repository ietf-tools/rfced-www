<template>
  <div class="mt-5 lg:mt-0 relative flex flex-col md:flex-row md:gap-2">
    <div class="flex flex-col">
      <DialogRoot>
        <DialogTrigger
          type="button"
          :class="[
            'text-pretty flex-inline flex-row gap-2 cursor-pointer mt-2 px-1 md:px-2 py-1 md:py-1 font-bold border-[2px]',
            {
              'text-white bg-blue-300 border-blue-300 dark:bg-blue-600 dark:border-blue-600 hover:bg-blue-400 focus:bg-blue-400 dark:hover:bg-blue-700 dark:focus:bg-blue-700 dark:hover:border-blue-700 dark:focus:border-blue-700':
                isSubscribedToSubseries,
              'text-blue-300 dark:text-blue-100 border-blue-300 dark:border-blue-200 hover:bg-blue-25 focus:bg-blue-25 dark:hover:bg-blue-950 dark:focus:bg-blue-950':
                !isSubscribedToSubseries
            }
          ]">
          <GraphicsCheckmark
            v-if="isSubscribedToSubseries"
            class="hidden sm:inline-block text-white w-[24px] h-[24px]" />
          <GraphicsAlert v-else class="hidden lg:inline-block text-blue-300 dark:text-blue-100 w-[24px] h-[24px]" />
          {{ isSubscribedToSubseries ? 'Subscribed' : 'Subscribe' }}
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay class="bg-black/10 backdrop-blur-xs fixed inset-0 z-110" />
          <DialogContent
            v-bind="dialogDescriptionAttrs(isAuthenticated)"
            :class="[
              'fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] translate-x-[-50%] translate-y-[-50%] z-115',
              'focus:outline-none rounded-md shadow-3xl',
              'bg-white dark:bg-gray-800',
              'px-4 pt-3 pb-1',
              {
                'max-w-[550px]': !isAuthenticated,
                'max-w-[350px]': isAuthenticated
              }
            ]">
            <DialogTitle class="text-lg font-semibold text-center pb-3">
              <template v-if="!isAuthenticated">You need an account to</template>
              <template v-else>{{ subseriesLabel }} Subscription</template>
            </DialogTitle>

            <template v-if="isAuthenticated">
              <div class="text-sm pt-3">
                <SubscriptionCheckboxHelpText />
                <CheckboxRoot
                  v-model="isSubscribed"
                  :disabled="!isSubscriptionLoaded"
                  class="flex items-start gap-2 w-full text-left cursor-pointer data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60">
                  <span
                    class="inline-flex shrink-0 items-center justify-center w-[20px] h-[20px] mt-0.5 border-1 rounded border-current/60">
                    <CheckboxIndicator>
                      <GraphicsCheckmark class="block w-[14px] h-[14px]" />
                    </CheckboxIndicator>
                  </span>
                  <span>Subscribe to {{ subseriesLabel }}</span>
                </CheckboxRoot>

                <div class="flex justify-end items-center gap-1 pb-2 pt-4">
                  <AsyncStatusIcon :status="syncStatus" label="your subscription" @retry="retry" />

                  <DialogClose
                    :class="[
                      'px-3 py-1 rounded-md',
                      'text-white bg-blue-600 dark:bg-blue-900',
                      'border border-gray-400',
                      'cursor-pointer'
                    ]">
                    Done
                  </DialogClose>
                </div>
              </div>
            </template>

            <div v-else class="text-sm pt-3">
              <LoginModalFeatureWall />
            </div>

            <DialogClose class="absolute top-2 right-2 px-2 py-2 cursor-pointer" aria-label="Close">
              <GraphicsClose />
            </DialogClose>
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * The subscribe dialog for one subseries.
 */
import {
  CheckboxIndicator,
  CheckboxRoot,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from 'reka-ui'
import { dialogDescriptionAttrs } from '~/utilities/accessibility'
import { useUserRFCSubscription } from '~/utilities/reef-subscriptions'
import type { SeriesId } from '~/utilities/rfc'

type Props = {
  subseriesId: SeriesId
}

const props = defineProps<Props>()

const subseriesLabel = computed(() => `${props.subseriesId.type.toUpperCase()} ${props.subseriesId.number}`)

const { isSubscribed, status, syncStatus, retry } = useUserRFCSubscription(() => props.subseriesId)

const isLoading = computed(() => status.value.type === 'loading')

// A checkbox that ticked before the subscriptions arrived would read as "not subscribed" rather
// than "not known yet", so it stays disabled until they have.
const isSubscriptionLoaded = computed(() => status.value.type === 'success')

// `user` is passed down to the subscribe and sets dialogs rather than left for them to read from
// the store themselves, so they render from what they're given and this component stays the one
// place that decides what "signed in" means for this row.
const { user } = storeToRefs(useAuthStore())

// Reef needs a bearer token to know whose subscription to store, so an anonymous tick could only
// fail with a 401. Ask for a sign-in instead of letting the checkbox look interactive and then
// silently lose it.
const isAuthenticated = computed(() => user.value !== undefined)

// Only true once signed in and the checkbox model reflects a loaded subscription, so the trigger
// doesn't flash the subscribed style for a signed-out reader or before the real status has arrived.
const isSubscribedToSubseries = computed(() => isAuthenticated.value && !isLoading.value && isSubscribed.value)
</script>

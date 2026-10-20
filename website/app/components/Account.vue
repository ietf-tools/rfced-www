<template>
  <div
    v-if="featureFlags.accountTabs === false"
    class="container mx-auto px-4 pt-5 grid grid-cols-1 md:grid-cols-2 gap-8">
    <AccountWebNotifications />

    <section>
      <AccountToggleEmail />
      <AccountSubscriptions />
      <AccountSets />
    </section>
  </div>
  <div v-else>
    <TabsRoot v-model="selectedTab" class="min-h-0 flex flex-col">
      <div class="bg-blue-900 dark:bg-blue-950">
        <TabsList class="container mx-auto mt-4 px-4 flex flex-row gap-1">
          <TabsIndicator class="absolute" />
          <TabsTrigger
            :class="[
              TAB_CLASS,
              {
                [SELECTED_CLASS]: selectedTab === PageTypes[0],
                [UNSELECTED_CLASS]: selectedTab !== PageTypes[0]
              }
            ]"
            :value="PageTypes[0]">
            <UserImageNotificationsWrapper class="pr-3"> Notifications </UserImageNotificationsWrapper>
          </TabsTrigger>
          <TabsTrigger
            :class="[
              TAB_CLASS,
              {
                [SELECTED_CLASS]: selectedTab === PageTypes[1],
                [UNSELECTED_CLASS]: selectedTab !== PageTypes[1]
              }
            ]"
            :value="PageTypes[1]">
            Subscriptions
          </TabsTrigger>
          <TabsTrigger
            :class="[
              TAB_CLASS,
              {
                [SELECTED_CLASS]: selectedTab === PageTypes[2],
                [UNSELECTED_CLASS]: selectedTab !== PageTypes[2]
              }
            ]"
            :value="PageTypes[2]">
            Sets
          </TabsTrigger>
          <TabsTrigger
            :class="[
              TAB_CLASS,
              {
                [SELECTED_CLASS]: selectedTab === PageTypes[3],
                [UNSELECTED_CLASS]: selectedTab !== PageTypes[3]
              }
            ]"
            :value="PageTypes[3]">
            Email
          </TabsTrigger>
        </TabsList>
      </div>

      <div class="container mx-auto mt-10 px-4">
        <TabsContent value="notifications">
          <AccountWebNotifications />
        </TabsContent>
        <TabsContent value="subscriptions">
          <AccountSubscriptions />
        </TabsContent>
        <TabsContent value="sets">
          <AccountSets />
        </TabsContent>
        <TabsContent value="email">
          <AccountToggleEmail />
        </TabsContent>
      </div>
    </TabsRoot>
  </div>
</template>

<script setup lang="ts">
import { useFeatureFlags } from '~/utilities/feature-flags'

const featureFlags = useFeatureFlags()

const PageTypes = ['notifications', 'subscriptions', 'sets', 'email'] as const
type PageType = (typeof PageTypes)[number]

const selectedTab = ref<PageType>('notifications')

const TAB_CLASS = 'px-3 py-2 font-medium cursor-pointer border-1 border-b-0'
const SELECTED_CLASS =
  'text-bold-without-layout-shift bg-gray-100 dark:bg-blue-25 text-gray-900 dark:text-gray-900 border-b-blue-900 dark:border-b-white'
const UNSELECTED_CLASS = 'border-b-transparent bg-blue-900 text-gray-100 dark:text-gray-300'
</script>

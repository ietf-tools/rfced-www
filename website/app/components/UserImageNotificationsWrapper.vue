<template>
  <div
    :class="[
      'relative',
      {
        'pr-0': unreadCount === 0,
        'pr-2': unreadCount > 0 && props.mode === 'top-right',
        'pr-1': unreadCount > 0 && props.mode === 'inline'
      }
    ]">
    <slot />
    <span
      v-if="unreadCount"
      :class="[
        {
          'absolute -right-2 -top-2 min-w-5': props.mode === 'top-right',
          'relative -top-0.5 min-w-5': props.mode === 'inline'
        },
        'bg-blue-200 text-white rounded-xl shadow-xl px-1 text-sm font-bold border-1 border-blue-600'
      ]"
      :aria-label="`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`"
      >{{ unreadCount }}</span
    >
  </div>
</template>

<script setup lang="ts">
type Props = {
  mode?: 'inline' | 'top-right'
}
const props = withDefaults(defineProps<Props>(), { mode: 'top-right' })

const webNotifications = useReefNotificationsStore()

const unreadCount = computed(() => filterNotificationsByUnread(webNotifications.notifications).length)
</script>

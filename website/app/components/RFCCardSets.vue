<template>
  <RFCDocumentSets
    :rfc-number="props.rfcNumber"
    :reef-stats="reefStats"
    :user="authStore.user"
    :sets="userSets"
    :icon-only="props.iconOnly"
    :create-set="createSet"
    :status="status"
    :sync-status="syncStatus"
    @retry="retry"
    v-model="setIdsWithThisRFC" />
</template>

<script setup lang="ts">
import { useUserSets } from '~/utilities/reef-sets'
import type { ReefRFCStats } from '~/utilities/rfc-validators'

type Props = {
  rfcNumber: number
  reefStats?: ReefRFCStats
  iconOnly?: boolean
}

const props = defineProps<Props>()

const authStore = useAuthStore()

const { sets: userSets, setIdsWithThisRFC, createSet, status, syncStatus, retry } = useUserSets(() => props.rfcNumber)
</script>

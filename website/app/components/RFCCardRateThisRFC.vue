<template>
  <RFCDocumentRateThisRFC
    :rfc-number="props.rfcNumber"
    :sync-status="syncStatus"
    @retry="retry"
    v-model="userRFCRating" />
</template>

<script setup lang="ts">
import { useUserRFCRating } from '~/utilities/reef-ratings'

type Props = {
  rfcNumber: number
}

const props = defineProps<Props>()

const { rating: userRFCRating, syncStatus, retry } = useUserRFCRating(() => props.rfcNumber)
</script>

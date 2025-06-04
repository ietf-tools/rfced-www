<template>
  <ais-stats>
    <template #default="{ nbHits, processingTimeMS }">
      <div class="text-base font-normal w-max">
        <span class="font-semibold">{{
          nbHits.toLocaleString('en', { useGrouping: true })
        }}</span>
        results in
        <span class="font-semibold">{{ processingTimeMS }} ms</span>
      </div>
    </template>
  </ais-stats>
</template>

<script setup lang="ts">
import { AisStats } from 'vue-instantsearch/vue3/es'
</script>
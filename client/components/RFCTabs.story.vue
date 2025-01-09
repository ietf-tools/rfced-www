<template>
  <Story title="RFC Tabs">
    <Variant title="Selected tab 0">
      <RFCTabs
        ref="desktopRFCTabs"
        v-model:selected-tab="selectedTab0"
        :rfc="exampleRfc"
      />
    </Variant>
    <Variant title="Selected tab 1">
      <RFCTabs
        ref="desktopRFCTabs"
        v-model:selected-tab="selectedTab1"
        :rfc="exampleRfc"
      />
    </Variant>
    <Variant title="Has errata">
      <RFCTabs
        ref="desktopRFCTabs"
        v-model:selected-tab="selectedTab2"
        :rfc="exampleRfc"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { exampleRfc } from '~/utilities/rfc'

const selectedTab0 = ref(0)
const selectedTab1 = ref(1)
const selectedTab2 = ref(2)
</script>

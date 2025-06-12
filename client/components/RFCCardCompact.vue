<template>
  <Card
    :href="infoRfcPathBuilder(`RFC${props.rfc.number}`)"
    :heading-level="props.headingLevel"
    has-cover-link
    :chevron-position="
      props.rfc.abstract && responsiveModeStore.responsiveMode === 'Desktop' ?
        'center'
      : 'end'
    "
    class="flex flex-row items-start"
    container-class="flex"
  >
    <template #headingTitle>
      <component :is="formatTitle(`rfc${props.rfc.number}`)" />
    </template>
    <p
      class="ml-4 pl-4 border-l-1 border-gray-300 text-base text-blue-900 dark:text-white"
    >
      {{ props.rfc.title }}
    </p>
  </Card>
</template>

<script setup lang="ts">
import type { Rfc } from '../generated/red-client'
import { infoRfcPathBuilder } from '../utilities/url'
import { formatTitle } from '~/utilities/rfc'
import { useResponsiveModeStore } from '~/stores/responsiveMode'

type Props = {
  rfc: Rfc
  showAbstract?: boolean
  showTagDate?: boolean
  headingLevel?: '1' | '2' | '3' | '4' | '5' | '6'
}

const props = withDefaults(defineProps<Props>(), { headingLevel: '1' })

const responsiveModeStore = useResponsiveModeStore()
</script>

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
    :class="props.showAbstract && props.rfc.abstract ? 'lg:flex' : undefined"
    :default-slot-class="
      props.showAbstract && props.rfc.abstract ?
        'lg:w-1/2 xl:w-2/5 pr-4'
      : undefined
    "
    :aside-slot-class="
      props.showAbstract && props.rfc.abstract ?
        'lg:w-1/2 xl:w-3/5 border-l pl-12 pr-4'
      : undefined
    "
  >
    <template #headingTitle>
      <component :is="formatTitle(`rfc${props.rfc.number}`)" />
    </template>
    <template #default>
      <RFCCardBody
        :rfc="props.rfc"
        :show-abstract="props.showAbstract"
        :show-tag-date="props.showTagDate"
      />
    </template>
    <template v-if="props.showAbstract && !!props.rfc.abstract" #aside>
      <div class="hidden lg:block mt-5">
        <!-- desktop abstract -->
        <Heading
          level="4"
          style-level="5"
          class="text-blue-900 dark:text-gray-300 inline-block"
        >
          Abstract
        </Heading>
        <p
          class="leading-snug text-gray-800 dark:text-gray-300 pb-2 text-pretty"
        >
          {{ props.rfc.abstract }}
        </p>
      </div>
    </template>
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

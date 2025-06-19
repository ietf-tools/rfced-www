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
      props.showAbstract && props.rfc.abstract ? 'pr-4' : 'ff'
    "
    :aside-slot-class="
      props.showAbstract && props.rfc.abstract ?
        'flex-1 lg:w-1/2 xl:w-3/5 border-l pl-12 pr-4'
      : undefined
    "
  >
    <template #headingTitle>
      <component :is="formatTitleAsVNode(`rfc${props.rfc.number}`)" />
    </template>
    <template #afterHeadingTitle>
      <span class="absolute z-100 right-3">
        <span class="text-sm text-gray-600 -mr-1"> part of </span>
        <NuxtLink
          to="/"
          class="no-underline hover:underline focus:underline hover:bg-gray-200 focus:bg-gray-200 px-2 py-1 rounded text-gray-700"
          title="Part of BCP10"
        >
          <component :is="formatTitleAsVNode(`bcp10`)" />
        </NuxtLink>
      </span>
    </template>
    <template #default>
      <RFCCardBody
        :rfc="props.rfc"
        :show-abstract="props.showAbstract"
        :show-tag-date="props.showTagDate"
      />
      <div
        v-if="props.showAbstract && !!props.rfc.abstract"
        class="hidden lg:block"
      >
        <!-- desktop abstract -->
        <Heading
          :level="abstractHeadingLevel"
          style-level="5"
          class="text-blue-900 dark:text-gray-300 inline-block mt-3 pt-2 border-t-1 border-gray-200"
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
import { infoRfcPathBuilder } from '../utilities/url'
import { formatTitleAsVNode } from '~/utilities/rfc'
import type { RfcCommon } from '~/utilities/rfc'
import { useResponsiveModeStore } from '~/stores/responsiveMode'
import { parseHeadingLevel, type HeadingLevel } from '~/utilities/html'

type Props = {
  rfc: RfcCommon
  showAbstract?: boolean
  showTagDate?: boolean
  headingLevel?: HeadingLevel
}

const props = withDefaults(defineProps<Props>(), { headingLevel: '1' })

const abstractHeadingLevel = computed(() =>
  parseHeadingLevel((parseFloat(props.headingLevel) + 1).toString())
)

const responsiveModeStore = useResponsiveModeStore()
</script>

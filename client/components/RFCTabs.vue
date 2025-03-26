<template>
  <TabsRoot
    v-slot="{ modelValue }"
    :selected-index="selectedTab"
    @change="changeTab"
  >
    <TabsList>
      <TabsIndicator />
      <TabsTrigger
        :class="[
          DEFAULT_CLASS,
          {
            [SELECTED_CLASS]: modelValue === 0,
            [UNSELECTED_CLASS]: modelValue !== 0
          }
        ]"
        value="0"
      >
        Contents
      </TabsTrigger>
      <TabsTrigger
        :class="[
          DEFAULT_CLASS,
          {
            [SELECTED_CLASS]: modelValue === 1,
            [UNSELECTED_CLASS]: modelValue !== 1
          }
        ]"
        value="1"
      >
        About this RFC
      </TabsTrigger>
      <TabsTrigger
        :class="[
          DEFAULT_CLASS,
          {
            [SELECTED_CLASS]: modelValue === 2,
            [UNSELECTED_CLASS]: modelValue !== 2
          }
        ]"
        value="2"
      >
        Erratum
      </TabsTrigger>
    </TabsList>
    <TabsContent value="0"></TabsContent>
    <TabsContent value="1">
      <Heading level="3" style-level="4" class="mt-4">Details</Heading>
      <dl class="text-sm">
        <dt class="font-bold mt-2">Updates</dt>
        <dd>...</dd>

        <dt class="font-bold mt-2">Date published</dt>
        <dd>{{ formattedPublished }}</dd>

        <dt class="font-bold mt-2">Authors</dt>
        <dd>
          <ul class="-mt-1">
            <li
              v-for="(author, authorIndex) in props.rfc.authors"
              :key="authorIndex"
              class="inline"
            >
              <a
                :href="authorPathBuilder(author)"
                class="whitespace-nowrap underline inline-block py-0.5 pr-1 mb-0.5"
              >
                {{ author.name }}
              </a>
              <template v-if="authorIndex < props.rfc.authors.length - 1">
                {{ COMMA }}
                {{ SPACE }}
              </template>
              <template v-else>.</template>
            </li>
          </ul>
        </dd>

        <dt class="font-bold mt-2">Working group</dt>
        <dd>
          <template v-if="props.rfc.group.acronym">
            {{ props.rfc.group.acronym.toUpperCase() }}
          </template>
          {{ props.rfc.group.name }}
        </dd>

        <dt class="font-bold mt-2">Area</dt>
        <dd>
          <template v-if="props.rfc.area?.acronym">
            {{ props.rfc.area.acronym.toUpperCase() }}
          </template>
          {{ props.rfc.area?.name }}
        </dd>

        <dt class="font-bold mt-2">Stream</dt>
        <dd>{{ props.rfc.stream.name }}</dd>

        <template v-if="props.rfc.identifiers">
          <template
            v-for="(identifier, identifierIndex) in props.rfc.identifiers"
            :key="identifierIndex"
          >
            <dt class="font-bold mt-2">
              <template v-if="identifier.type === 'doi'">
                <abbr title="Digital object identifier">DOI</abbr>
              </template>
              <template v-else>
                {{ identifier.type }}
              </template>
            </dt>
            <dd>
              {{ identifier.value }}
            </dd>
          </template>
        </template>

        <dt class="font-bold mt-2">
          <abbr title="International Standard Serial Number">ISSN</abbr>
        </dt>
        <dd>ISSN number where?</dd>
      </dl>

      <Heading level="3" class="mt-5 mb-2">Cite this RFC</Heading>
      <ul class="text-sm flex flex-col gap-2">
        <li v-for="(citation, citationIndex) in citations" :key="citationIndex">
          <a :href="citation.url" class="underline block px-2 -ml-2">
            {{ citation.title }}
          </a>
        </li>
      </ul>

      <Heading level="3" class="mt-5 mb-2">Formats</Heading>
      <ul class="text-sm flex flex-col gap-2">
        <li v-for="(format, formatIndex) in formats" :key="formatIndex">
          <a :href="format.url" class="underline block px-2 -ml-2">{{
            format.title
          }}</a>
        </li>
      </ul>
    </TabsContent>
    <TabsContent value="2">
      <ul class="text-sm">
        <li
          v-for="(errataItem, errataIndex) in props.rfc.obsoleted_by"
          :key="errataIndex"
        >
          {{ errataItem }}
        </li>
      </ul>
    </TabsContent>
  </TabsRoot>
</template>

<script setup lang="ts">
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger
} from 'reka-ui'
import { DateTime } from 'luxon'
import type { Rfc } from '~/generated/red-client'
import { formatDatePublished } from '~/utilities/rfc'
import { COMMA, SPACE } from '~/utilities/strings'
import {
  authorPathBuilder,
  rfcCitePathBuilder,
  rfcFormatPathBuilder
} from '~/utilities/url'

type Props = {
  rfc: Rfc
}

const props = defineProps<Props>()

const selectedTab = defineModel<number>('selectedTab')

function changeTab(index: number) {
  selectedTab.value = index
}

const formattedPublished = computed(() => {
  const dt = DateTime.fromISO(props.rfc.published)
  return formatDatePublished(dt, true)
})

const citations = computed(() => {
  return [
    { url: rfcCitePathBuilder(`RFC${props.rfc.number}`, 'txt'), title: 'TXT' },
    { url: rfcCitePathBuilder(`RFC${props.rfc.number}`, 'xml'), title: 'XML' },
    {
      url: rfcCitePathBuilder(`RFC${props.rfc.number}`, 'bibTeX'),
      title: 'BibTeX'
    }
  ]
})

const formats = computed(() => {
  return [
    {
      url: rfcFormatPathBuilder(`RFC${props.rfc.number}`, 'html'),
      title: 'HTML'
    }
  ]
})

const DEFAULT_CLASS = 'py-4 whitespace-nowrap'
const SELECTED_CLASS =
  'border-b-2 border-b-blue-900 dark:border-b-white font-medium'
const UNSELECTED_CLASS = 'text-gray-800 dark:text-gray-300'
</script>

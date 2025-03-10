<template>
  <HeadlessTabGroup :selected-index="selectedTab" @change="changeTab">
    <HeadlessTabList class="flex gap-7 border-b mr-6">
      <HeadlessTab v-slot="{ selected }" as="template">
        <button
          type="button"
          :class="[
            DEFAULT_CLASS,
            { [SELECTED_CLASS]: selected, [UNSELECTED_CLASS]: !selected }
          ]"
        >
          Contents
        </button>
      </HeadlessTab>
      <HeadlessTab v-slot="{ selected }" as="template">
        <button
          type="button"
          :class="[
            DEFAULT_CLASS,
            { [SELECTED_CLASS]: selected, [UNSELECTED_CLASS]: !selected }
          ]"
        >
          About this RFC
        </button>
      </HeadlessTab>
      <HeadlessTab
        v-if="props.rfc.obsoleted_by"
        v-slot="{ selected }"
        as="template"
      >
        <button
          type="button"
          :class="[
            DEFAULT_CLASS,
            { [SELECTED_CLASS]: selected, [UNSELECTED_CLASS]: !selected }
          ]"
          data-errata-tab
        >
          <template v-if="props.rfc.obsoleted_by.length === 1">
            Erratum
          </template>
          <template v-else>Errata</template>

          <DiamondText
            class="lg:absolute ml-1"
            :text="props.rfc.obsoleted_by.length.toString()"
          />
        </button>
      </HeadlessTab>
    </HeadlessTabList>
    <HeadlessTabPanels class="">
      <HeadlessTabPanel>Content 1</HeadlessTabPanel>
      <HeadlessTabPanel>
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
                  class="whitespace-nowrap inline-block py-0.5 pr-1 mb-0.5"
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
          <li
            v-for="(citation, citationIndex) in citations"
            :key="citationIndex"
          >
            <a :href="citation.url" class="block px-2 -ml-2">
              {{ citation.title }}
            </a>
          </li>
        </ul>

        <Heading level="3" class="mt-5 mb-2">Formats</Heading>
        <ul class="text-sm flex flex-col gap-2">
          <li v-for="(format, formatIndex) in formats" :key="formatIndex">
            <a :href="format.url" class="block px-2 -ml-2">{{
              format.title
            }}</a>
          </li>
        </ul>
      </HeadlessTabPanel>
      <HeadlessTabPanel v-if="props.rfc.obsoleted_by">
        <ul class="text-sm">
          <li
            v-for="(errataItem, errataIndex) in props.rfc.obsoleted_by"
            :key="errataIndex"
          >
            {{ errataItem }}
          </li>
        </ul>
      </HeadlessTabPanel>
    </HeadlessTabPanels>
  </HeadlessTabGroup>
</template>

<script setup lang="ts">
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

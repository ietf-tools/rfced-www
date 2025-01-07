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
          <template v-if="props.rfc.obsoleted_by.length === 1"
            >Erratum</template
          >
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
        <Heading level="3">Details</Heading>
        <dl>
          <dt>Updates</dt>
          <dd></dd>

          <dt>Date published</dt>
          <dd>{{ formattedPublished }}</dd>

          <dt>Authors</dt>
          <dd>
            <ul>
              <li
                v-for="(author, authorIndex) in props.rfc.authors"
                class="inline"
              >
                <a :href="authorPathBuilder(author)">{{ author.name }}</a>
                <template v-if="authorIndex < props.rfc.authors.length - 1"
                  >,{{ SPACE }}</template
                >
                <template v-else>.</template>
              </li>
            </ul>
          </dd>

          <dt>Working group</dt>
          <dd>
            <template v-if="props.rfc.group.acronym">
              {{ props.rfc.group.acronym.toUpperCase() }}
            </template>
            {{ props.rfc.group.name }}
          </dd>

          <dt>Area</dt>
          <dd>
            <template v-if="props.rfc.area?.acronym">
              {{ props.rfc.area.acronym.toUpperCase() }}
            </template>
            {{ props.rfc.area?.name }}
          </dd>

          <dt>Stream</dt>
          <dd>{{ props.rfc.stream.name }}</dd>

          <template v-if="props.rfc.identifiers?.value">
            <dt><abbr title="Digital Object IDentifier">DOI</abbr></dt>
            <dd>{{ props.rfc.identifiers.value }}</dd>
          </template>

          <dt>
            <abbr title="International Standard Serial Number">ISSN</abbr>
          </dt>
          <dd>ISSN number where?</dd>
        </dl>
        <Heading level="3">Cite this RFC</Heading>
        <ul>
          <li v-for="citation in citations">
            <a :href="citation.url">{{ citation.title }}</a>
          </li>
        </ul>
      </HeadlessTabPanel>
      <HeadlessTabPanel v-if="props.rfc.obsoleted_by">
        <ul>
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
import { authorPathBuilder, rfcCitePathBuilder } from '~/utilities/url'

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
  if (dt.month === 4 && dt.day === 1) {
    // handle April 1st
    return dt.toLocaleString(DateTime.DATE_FULL)
  }
  return dt.toFormat('LLLL yyyy')
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

const DEFAULT_CLASS = 'py-4 whitespace-nowrap'
const SELECTED_CLASS =
  'border-b-2 border-b-blue-900 dark:border-b-white font-medium'
const UNSELECTED_CLASS = 'text-gray-800 dark:text-gray-300'
const SPACE = ' '
</script>

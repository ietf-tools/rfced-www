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
      <HeadlessTab v-if="props.errata" v-slot="{ selected }" as="template">
        <button
          type="button"
          :class="[
            DEFAULT_CLASS,
            { [SELECTED_CLASS]: selected, [UNSELECTED_CLASS]: !selected }
          ]"
          data-errata-tab
        >
          <template v-if="props.errata.length === 1">Erratum</template>
          <template v-else>Errata</template>

          <DiamondText
            class="lg:absolute ml-1"
            :text="props.errata.length.toString()"
          />
        </button>
      </HeadlessTab>
    </HeadlessTabList>
    <HeadlessTabPanels class="">
      <HeadlessTabPanel>Content 1</HeadlessTabPanel>
      <HeadlessTabPanel>Content 2</HeadlessTabPanel>
      <HeadlessTabPanel v-if="props.errata">
        <ul>
          <li
            v-for="(errataItem, errataIndex) in props.errata"
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
type Props = {
  errata?: string[]
}

const props = defineProps<Props>()

const selectedTab = defineModel<number>('selectedTab')

function changeTab(index: number) {
  selectedTab.value = index
}

const DEFAULT_CLASS = 'py-4 whitespace-nowrap'
const SELECTED_CLASS =
  'border-b-2 border-b-blue-900 dark:border-b-white font-medium'
const UNSELECTED_CLASS = 'text-gray-800 dark:text-gray-300'
</script>

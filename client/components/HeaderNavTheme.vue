<template>
  <HeadlessListbox
    v-model="$colorMode.preference"
    as="div"
    class="relative flex items-center"
  >
    <HeadlessListboxButton>
      <span
        :title="`Theme: ${
          colorPreferences.find(
            (colourPreference) =>
              colourPreference.value === colorMode.preference
          ).label
        }`"
      >
        <Icon name="fluent:dark-theme-20-filled" />
      </span>
    </HeadlessListboxButton>
    <transition
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <HeadlessListboxOptions
        class="absolute z-10 right-0 bg-white text-black dark:bg-black dark:text-white dark:border-2 mt-1 w-[10em] top-[40px] max-h-60 rounded-md py-1 shadow-lg"
      >
        <div class="text-xs font-bold px-2 py-1">Select theme:</div>
        <HeadlessListboxOption
          v-for="colorPreference in colorPreferences"
          :key="colorPreference.value"
          v-slot="{ active, selected }"
          :value="colorPreference.value"
        >
          <div
            :class="[
              'flex items-center px-2',
              {
                'bg-blue-500 text-white': active
              }
            ]"
          >
            <span class="w-5">
              <Icon v-show="selected" name="fluent:checkmark-12-filled" />
            </span>
            {{ colorPreference.label }}
          </div>
        </HeadlessListboxOption>
      </HeadlessListboxOptions>
    </transition>
  </HeadlessListbox>
</template>

<script setup type="ts">
const colorMode = useColorMode()

const colorPreferences = [
  { value: 'system', label: 'System default' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'sepia', label: 'Sepia' },
]
</script>

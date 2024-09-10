<template>
  <div class="min-h-[100vh]">
    <NuxtLayout name="default">
      <template #subheader>
        <div class="container mx-auto">
          <Heading level="1" class="w-full mt-0 mb-3 pl-5 md:p-0 text-balance">
            Search RFCs
          </Heading>
          <SearchBox />
        </div>
      </template>

      <div
        class="flex flex-col-reverse lg:flex-row lg:items-center justify-between"
      >
        <Heading level="2" has-icon class="text-left pl-5 md:pl-0">
          Showing <b>12 results</b> for "{{}}"
        </Heading>
        <form class="text-base text-grey-800 pt-3 lg:pt-0 pl-5 md:pl-0">
          <label>
            Sort by
            <select>
              <option>RFC no. (Lowest first)</option>
              <option>RFC no. (Highest first)</option>
            </select>
          </label>
        </form>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>

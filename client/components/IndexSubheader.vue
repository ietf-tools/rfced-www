<template>
  <div class="container mx-auto">
    <ThreeBarGraphic
      width="500"
      height="400"
      class="absolute bottom-0 left-[150px]"
      :opacity="0.04"
    />
    <ThreeBarGraphic
      width="200"
      height="200"
      class="absolute bottom-0 left-[525px]"
      :opacity="0.04"
    />
    <div class="lg:flex w-full">
      <Heading level="1" class="w-full mt-5 mb-3">
        The official home of RFCs
      </Heading>
      <div class="self-end">
        <a
          href="/what"
          class="flex items-center gap-2 rounded p-2 font-bold text-nowrap hover:bg-black"
        >
          What is an RFC?
          <ChevronGraphic class="-rotate-90" />
        </a>
      </div>
    </div>

    <div class="lg:w-1/2">
      <p>
        RFCs outline computer networking and Internet foundations, including
        <a href="/internet-standards">Internet Standards</a> and historical or
        informative content. They are published by the RFC Editor for the
        <a href="/ietf">
          <abbr title="Internet Engineering Task Force">IETF</abbr> </a
        >,
        <a href="/irtf"
          ><abbr title="Internet Reserach Task Force">IRTF</abbr></a
        >,
        <a href="/iab"><abbr title="Internet Architecture Board">IAB</abbr></a
        >, and
        <a href="/ise"><abbr title="Independent Submission Editor">ISE</abbr></a
        >, which collectively form the authoritative source for RFCs
      </p>
      <form method="get" action="/search" class="w-full flex pt-4 pb-6">
        <input
          type="text"
          class="flex-1 bg-white text-black dark:bg-black dark:text-white"
          placeholder="Find an RFC (e.g. ‘RFC 7120’)"
          aria-label="Find an RFC (e.g. ‘RFC 7120’)"
        />
        <button type="submit" class="bg-blue-200 px-2 flex items-center">
          <Icon name="fluent:search-12-filled" size="2em" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// FIXME: reconsider `placeholder` for a11y reasons
</script>

<template>
  <div class="container mx-auto">
    <div class="absolute pointer-events-none inset-0 overflow-hidden">
      <GraphicsIETFMotif
        width="500"
        height="400"
        class="absolute bottom-0 left-[150px]"
        :opacity="0.04"
      />
      <GraphicsIETFMotif
        width="200"
        height="200"
        class="absolute bottom-0 left-[525px]"
        :opacity="0.04"
      />
    </div>
    <div class="lg:flex w-full">
      <Heading level="1" class="w-full mt-0 mb-3 pl-5 md:p-0 text-balance">
        The official home of RFCs
      </Heading>
      <div class="self-end sm:text-right">
        <a
          href="/what"
          class="rounded inline-block px-5 py-3 font-bold text-nowrap hover:bg-black"
        >
          What is an RFC?
          <GraphicsChevron class="-rotate-90 w-[16px] inline-block" />
        </a>
      </div>
    </div>

    <div class="lg:w-1/2">
      <p class="pl-5 md:p-0">
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

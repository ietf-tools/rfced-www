<template>
  <div class="container mx-auto">
    <div class="absolute pointer-events-none inset-0 overflow-hidden">
      <GraphicsIETFMotif
        class="absolute left-[57vw] top-[25vh] w-[30vw] h-[30vh]"
        :opacity="0.04"
      />
      <GraphicsIETFMotif
        class="absolute w-[80vw] h-[80vh] bottom-0 left-[0px]"
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

    <div class="lg:w-2/3 xl:w-1/2">
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
      <SearchBox />
    </div>
  </div>
</template>

<script setup lang="ts">
// FIXME: reconsider `placeholder` for a11y reasons
</script>

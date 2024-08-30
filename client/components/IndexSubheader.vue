<template>
  <div class="container mx-auto flex">
    <div class="w-2/3">
      <h1 class="text-4xl font-bold">The official home of RFCs</h1>
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
      <form method="get" action="/search">
        <input type="text" />
        <button type="submit">?</button>
      </form>
    </div>
    <a class="w-1/3" href="/what">What is an RFC?</a>
  </div>
</template>

<template>
  <Story title="RFC Document">
    <RFCDocument
      id="rfc1234"
      :meta="meta"
      intro="CBOR Object Signing and Encryption (COSE): Countersignatures"
      :pages-html="pagesHtml"
      :errata="errata"
      obsoleted-by="RFC9052CBOR"
      see-also="RFC9052CBOR"
    />
  </Story>
</template>

<script setup lang="ts">
const meta = h('span', [
  'part of ',
  h('a', { href: '/info/std96' }, ['STD 96'])
])

const pagesHtml = [
  `Network Working Group                                      J. Bouknight
Request for Comments: 76                                      J. Madden
NIC 5180                                                    G. Grossman
                                                 University of Illinois
                                                        28 October 1970


               <span class="h1">Connection-By-Name: User-Oriented Protocol</span>


<span class="h2"><a class="selflink" id="appendix-I" href="#appendix-I">I</a>. Introduction</span>

   Shortly after the first of the year, 1971, the Center for Advanced
   Computation (CAC) at the University of Illinois will begin to use the
   facilities of the ARPA network.  We are the first of a small class of
   network nodes whose chief characteristic is that the node is a port
   to the network only.  All computational power for these nodes will be
   taken from other nodes on the network, ILLIAC IV for example.

   An important characteristic of most of the users at our Center is a
   lack of sophistication about data communication techniques and
   practices.  The user will eventually be in the majority of those
   using the network from all nodes but the problem is ours, almost from
   the start.

   In our discussions with our prospective users of the network as we
   designed our port facility, we found that the greatest confusion and
   consternation arose over having to deal with network protocol at the
   "nitty-gritty" level of sockets, links, etc.  While most of them have
   been acclimated to computer systems at the file and device-by-name
   level where the software system handles details, here on the current
   version of the network, the user handles all details.

   Thus, we were compelled to seek a user level interface to network
   protocol where all user protocol is handled symbolically with system
   procedures making the translation into host-to-host protocol.

   Currently, connections are established by exchange of known socket
   numbers for the four loose ends of the connection.  This requires
   either that the user or process always know all socket numbers he
   will use at his or other installations OR that his NCP (and/or
   related software) remember them for him, allowing him to reference
   them symbolically.

   We propose a more general solution to the "telephone book" approach
   of obtaining socket numbers for user or processes.  Only the host, at
   each site, knows its socket number space at any given instant in time
   as well as the status of the user or process to which a socket number



<span class="grey">Bouknight, et al.                                               [Page 1]</span>`
]

const errata = ['something', 'something else', 'and something else']
</script>

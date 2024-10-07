<template>
  <Story
    title="RFC Card"
  >
    <RFCCard
        href="/"
        title="RFC9392"
        heading-level="3"
        author="C. Perkins"
        :tag="{
            type: 'Informational',
            date: new Date(Date.now() - 3 * (24 * 60 * 60 * 1000))
        }"
        intro="Message Header Field for Indicating Message Authentication Status"
        :body="['C. Perkins', 'Date']"
        :footer="['IETF Stream']"
        >
        Sending RTP Control Protocol (RTPCP) Feedback for Congestion Control
        in Interactive Multimedia Conferences
    </RFCCard>
  </Story>
</template>

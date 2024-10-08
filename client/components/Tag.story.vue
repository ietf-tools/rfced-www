<template>
  <Story title="Tag(s)">
    <Tag
      :text="[
        'Some',
        '1'
        // short title
      ]"
    />
    <Tag
      :text="[
        'Internet Standard',
        '1234'
        // normal title
      ]"
    />
    <Tag :text="['Internet Standard', '12345']" />
    <Tag :text="['Internet Standard', 'A Long Title']" />
  </Story>
</template>

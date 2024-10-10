<template>
  <Story title="Tag(s)">
    <Variant title="Tag - short title">
      <Tag :text="['Some', '1']" />
    </Variant>
    <Variant title="Tag - normal title">
      <Tag :text="['Internet Standard', '1234']" />
    </Variant>
    <Variant title="Tag - longer title">
      <Tag :text="['Internet Standard', '12345']" />
    </Variant>
    <Variant title="Tag - Longest title">
      <Tag :text="['Internet Standard', 'A Long Title']" />
    </Variant>
  </Story>
</template>

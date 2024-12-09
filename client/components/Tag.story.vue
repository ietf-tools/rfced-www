<template>
  <Story title="Tag(s)">
    <Variant title="Tag - 1 part - short title">
      <Tag :text="['Some1']" />
    </Variant>
    <Variant title="Tag - 1 part - normal title">
      <Tag :text="['Internet Standard 1234']" />
    </Variant>
    <Variant title="Tag - 1 part - longer title">
      <Tag :text="['Internet Standard 12345']" />
    </Variant>
    <Variant title="Tag - 1 part - Longest title">
      <Tag :text="['Internet Standard A Long Title']" />
    </Variant>
    <Variant title="Tag - 2 part - short title">
      <Tag :text="['Some', '1']" />
    </Variant>
    <Variant title="Tag - 2 part - normal title">
      <Tag :text="['Internet Standard', '1234']" />
    </Variant>
    <Variant title="Tag - 2 part - longer title">
      <Tag :text="['Internet Standard', '12345']" />
    </Variant>
    <Variant title="Tag - 2 part - Longest title">
      <Tag :text="['Internet Standard', 'A Long Title']" />
    </Variant>
  </Story>
</template>

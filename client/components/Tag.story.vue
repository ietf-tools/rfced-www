<template>
  <Story title="Tag(s)">
    <!-- size normal -->
    <Variant title="Tag - 1 part - short title - normal size">
      <Tag :text="['Some1']" size="normal" />
    </Variant>
    <Variant title="Tag - 1 part - normal title - normal size">
      <Tag :text="['Internet Standard 1234']" size="normal" />
    </Variant>
    <Variant title="Tag - 1 part - longer title - normal size">
      <Tag :text="['Internet Standard 12345']" size="normal" />
    </Variant>
    <Variant title="Tag - 1 part - Longest title - normal size">
      <Tag :text="['Internet Standard A Long Title']" size="normal" />
    </Variant>
    <Variant title="Tag - 2 part - short title - normal size">
      <Tag :text="['Some', '1']" size="normal" />
    </Variant>
    <Variant title="Tag - 2 part - normal title - normal size">
      <Tag :text="['Internet Standard', '1234']" size="normal" />
    </Variant>
    <Variant title="Tag - 2 part - longer title - normal size">
      <Tag :text="['Internet Standard', '12345']" size="normal" />
    </Variant>
    <Variant title="Tag - 2 part - Longest title - normal size">
      <Tag :text="['Internet Standard', 'A Long Title']" size="normal" />
    </Variant>
    <!-- size small -->
    <Variant title="Tag - 1 part - short title - small size">
      <Tag :text="['Some1']" size="small" />
    </Variant>
    <Variant title="Tag - 1 part - normal title - small size">
      <Tag :text="['Internet Standard 1234']" size="small" />
    </Variant>
    <Variant title="Tag - 1 part - longer title - small size">
      <Tag :text="['Internet Standard 12345']" size="small" />
    </Variant>
    <Variant title="Tag - 1 part - Longest title - small size">
      <Tag :text="['Internet Standard A Long Title']" size="small" />
    </Variant>
    <Variant title="Tag - 2 part - short title - small size">
      <Tag :text="['Some', '1']" size="small" />
    </Variant>
    <Variant title="Tag - 2 part - normal title - small size">
      <Tag :text="['Internet Standard', '1234']" size="small" />
    </Variant>
    <Variant title="Tag - 2 part - longer title - small size">
      <Tag :text="['Internet Standard', '12345']" size="small" />
    </Variant>
    <Variant title="Tag - 2 part - Longest title - small size">
      <Tag :text="['Internet Standard', 'A Long Title']" size="small" />
    </Variant>
  </Story>
</template>

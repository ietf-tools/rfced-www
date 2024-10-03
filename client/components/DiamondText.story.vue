<template>
  <Story
    title="DiamondText"
    :layout="{
      type: 'grid',
      width: 200
    }"
  >
    <Variant title="1 char DiamondText">
      <DiamondText text="3" />
    </Variant>
    <Variant title="2 chars DiamondText">
      <DiamondText text="33" />
    </Variant>
    <Variant title="3 chars DiamondText">
      <DiamondText text="333" />
    </Variant>
  </Story>
</template>

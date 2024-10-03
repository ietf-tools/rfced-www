<template>
  <Story
    title="Card"
    :layout="{
      type: 'grid',
      width: 200
    }"
  >
    <Variant title="Short card">
      <Card href="/sdf" heading-level="3" has-cover-link>
        <template #headingTitle>
          A normal length title with <span class="font-thin">formatting</span>
        </template>
        <p class="text-base mt-2 text-blue-900 dark:text-white">
          A short description
        </p>
      </Card>
    </Variant>
    <Variant title="Long card">
      <Card href="/sdf" heading-level="2" has-cover-link>
        <template #headingTitle>
          A very long card heading that keeps going and going and eventually
          stops with <i>some</i> <span class="font-thin">formatting</span>
        </template>
        <p>
          A very long card body that keeps going and going and eventually stops
        </p>
      </Card>
    </Variant>
  </Story>
</template>

<template>
  <Story
    title="Breadcrumbs"
    :layout="{
      type: 'grid',
      width: '500px'
    }"
  >
    <Variant title="Short breadcrumbs">
      <Breadcrumbs :breadcrumb-items="[{ url: '/', label: 'Home' }]" />
    </Variant>
    <Variant title="Long breadcrumbs">
      <Breadcrumbs
        :breadcrumb-items="[
          { url: '/', label: 'Home' },
          { url: '/info', label: 'Documents' },
          { url: '/info', label: 'Something else' }
        ]"
      />
    </Variant>
  </Story>
</template>

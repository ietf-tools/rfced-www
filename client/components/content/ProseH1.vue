<template>
  <Heading
    v-bind="$attrs"
    level="1"
    class="pt-10 pb-3"
    :has-internal-link="false"
  >
    <slot />
  </Heading>
</template>

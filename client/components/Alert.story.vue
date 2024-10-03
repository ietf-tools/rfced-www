<template>
  <Story
    title="Alert"
    :layout="{
      type: 'grid',
      width: 350,
      defaultColorScheme: 'light'
    }"
  >
    <Variant title="Warning Alert" theme="light">
      <Alert variant="warning" heading="This alert is a warning">
        <p class="text-sm">
          For more information, please refer to the documentation
        </p>
      </Alert>
    </Variant>
    <Variant title="Info Alert">
      <Alert variant="info" heading="This RFC is now obsolete">
        <p class="text-sm">
          For more information, please refer to the documentation
        </p>
      </Alert>
    </Variant>
  </Story>
</template>

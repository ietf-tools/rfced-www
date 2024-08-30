<template>
  <div>
    <Header>
      <slot name="subheader"></slot>
    </Header>
    <Main>
      <slot />
    </Main>
    <Footer></Footer>
  </div>
</template>

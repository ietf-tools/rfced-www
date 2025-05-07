<template>
  <div
    ref="scroll-container"
    :class="{
      'overflow-x-scroll w-full max-w-[100vw] transition-shadow duration-800': true,
      'shadow-[inset_70px_0px_90px_-70px_rgba(0,_45,_60,_0.5),inset_36px_0px_20px_-36px_rgba(0,_45,_60,_0.5)] dark:shadow-[inset_70px_0px_90px_-70px_rgba(140,_201,_222,_0.5),inset_36px_0px_20px_-36px_rgba(140,_201,_222,_0.5)]':
        canScrollLeft && !canScrollRight,
      'shadow-[inset_-70px_0px_90px_-70px_rgba(0,_45,_60,_0.5),inset_-36px_0px_20px_-36px_rgba(0,_45,_60,_0.5)] dark:shadow-[inset_-70px_0px_90px_-70px_rgba(140,_201,_222,_0.5),inset_-36px_0px_20px_-36px_rgba(140,_201,_222,_0.5)]':
        !canScrollLeft && canScrollRight,
      'shadow-[inset_70px_0px_90px_-70px_rgba(0,_45,_60,_0.5),inset_-70px_0px_90px_-70px_rgba(0,_45,_60,_0.5)] dark:shadow-[inset_70px_0px_90px_-70px_rgba(140,_201,_222,_0.5),inset_-70px_0px_90px_-70px_rgba(140,_201,_222,_0.5)]':
        canScrollLeft && canScrollRight
    }"
    @scroll="updateScrollHint"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const scrollContainer = useTemplateRef('scroll-container')
const canScrollLeft = ref(false)
const canScrollRight = ref<boolean>(false)

const updateScrollHint = () => {
  const { value: scrollContainerElement } = scrollContainer
  if (!scrollContainerElement) {
    console.error('Unable to find scroll container. This is a bug')
    return
  }
  canScrollLeft.value = scrollContainerElement.scrollLeft > 0
  canScrollRight.value =
    scrollContainerElement.scrollLeft + scrollContainerElement.offsetWidth <
    scrollContainerElement.scrollWidth
}

onMounted(updateScrollHint)
</script>

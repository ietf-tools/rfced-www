import { watch } from 'vue'
import { throttle, clamp } from 'lodash-es'

const SCROLL_FPS = 30
const ANIMATE_INDEX_FPS = 10
const MINIMUM_VELOCITY = 1
const FRICTION = 1
const ENDS_THRESHOLD_PX = 10

export const useActiveScroll = (ids: Ref<string[]>) => {
  const activeIdRef = ref(ids.value[0])
  let activeIdIndex = -1 // should be kept in sync with activeIdRef.value's index within ids.value
  let targetIdIndex = -1

  let velocity = 0
  let elements: HTMLElement[]
  let elementTops: number[]
  let animationCallbackHandle: ReturnType<typeof setTimeout>

  const setActive = (id: string) => {
    activeIdIndex = ids.value.indexOf(id)
    if (activeIdIndex === -1) {
      throw Error(
        `setActiveId(${JSON.stringify(id)}) wasn't found in ids (${JSON.stringify(ids.value)})`
      )
    }
    activeIdRef.value = id
  }

  const setActiveIdByIndex = (index: number) => {
    if (index < 0 || index >= ids.value.length) {
      throw Error(
        `setActiveIdByIndex(${index}) was out of bounds. ids.length = ${ids.value.length})`
      )
    }
    activeIdIndex = index
    activeIdRef.value = ids.value[index]
  }

  const updateElements = () => {
    elements = Array.from(
      document.querySelectorAll(ids.value.map((id) => `#${id}`).join(','))
    )
    if (elements.length !== ids.value.length) {
      throw Error(
        `Some ids weren't found: ${JSON.stringify(ids.value.filter((id) => elements.some((element) => element.id === id)))}`
      )
    }
    elementTops = elements.map(
      (element) => element.getBoundingClientRect().top + window.scrollY
    )
  }

  const getIdsIndexOfClosestTop = (scrollY: number): number => {
    if (scrollY < ENDS_THRESHOLD_PX) {
      console.log('at top so use index 0')
      return 0
    } else if (
      scrollY >
      document.body.scrollHeight - window.innerHeight - ENDS_THRESHOLD_PX
    ) {
      console.log('at bottom so use index ', elementTops.length - 1)
      return elementTops.length - 1
    }
    console.log(scrollY, ' < ', document.body.scrollHeight - ENDS_THRESHOLD_PX)
    let closestIndex = 0
    console.log('elementTops.length', elementTops.length)
    for (let i = 0; i < elementTops.length; i++) {
      const elementTop = elementTops[i]
      if (
        Math.abs(scrollY - elementTop) <
        Math.abs(scrollY - elementTops[closestIndex])
      ) {
        closestIndex = i
      }
    }
    console.log({ closestIndex })
    return closestIndex
  }

  watch(ids, updateElements)

  const animateActiveIndex = () => {
    const direction = targetIdIndex > activeIdIndex ? 1 : -1

    let newActiveIdIndex = activeIdIndex + Math.round(velocity)

    // clamp (1) within array bounds, and (2) without overshooting/undershooting
    newActiveIdIndex = clamp(
      activeIdIndex + Math.round(velocity),
      // if undershooting
      direction === -1 && newActiveIdIndex < targetIdIndex ? targetIdIndex : 0,
      // if overshooting
      direction === 1 && newActiveIdIndex > targetIdIndex ?
        targetIdIndex
      : ids.value.length
    )

    console.log({ direction, velocity })
    // slow it down
    velocity =
      Math.max(
        velocity + (direction === 1 ? -FRICTION : FRICTION),
        MINIMUM_VELOCITY
      ) * direction

    setActiveIdByIndex(newActiveIdIndex)

    if (newActiveIdIndex === targetIdIndex) {
      console.log('Done')
      if (animationCallbackHandle) {
        clearTimeout(animationCallbackHandle)
      }
      velocity = 0
    } else {
      animateSoon()
    }
  }

  const animateSoon = () => {
    if (animationCallbackHandle) {
      clearTimeout(animationCallbackHandle)
    }
    animationCallbackHandle = setTimeout(
      animateActiveIndex,
      1000 / ANIMATE_INDEX_FPS
    )
  }

  const handleScroll = () => {
    console.log('handle scroll')
    const { scrollY } = window
    targetIdIndex = getIdsIndexOfClosestTop(scrollY)
    console.log({ targetIdIndex, activeIdIndex })
    if (targetIdIndex === activeIdIndex) {
      // nothing to do, exit early
      console.log('No activeId change needed')
      return
    }
    console.log(
      `New scroll target from `,
      activeIdIndex,
      JSON.stringify(ids.value[activeIdIndex]),
      ' to ',
      targetIdIndex,
      JSON.stringify(ids.value[targetIdIndex])
    )
    const direction = targetIdIndex > activeIdIndex ? 1 : -1
    const distanceToIndex = Math.abs(targetIdIndex - activeIdIndex)
    velocity = Math.max(distanceToIndex / 5, MINIMUM_VELOCITY) * direction
    animateSoon()
  }

  const throttledHandleScroll = throttle(handleScroll, 1000 / SCROLL_FPS)

  const throttledHandleResize = throttle(() => {
    updateElements()
    handleScroll()
  }, 100)

  onMounted(() => {
    updateElements()
    document.addEventListener('scroll', throttledHandleScroll, {
      passive: true
    })
    document.addEventListener('resize', throttledHandleResize, {
      passive: true
    })
  })

  onUnmounted(() => {
    document.removeEventListener('scroll', throttledHandleScroll)
    document.removeEventListener('resize', throttledHandleResize)
    if (animationCallbackHandle) {
      clearTimeout(animationCallbackHandle)
    }
  })

  return {
    activeId: activeIdRef,
    setActive
  }
}

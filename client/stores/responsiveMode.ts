export type ResponsiveMode = null | 'Desktop' | 'Mobile'

const getResponsiveMode = (): ResponsiveMode => {
  if (typeof window === 'undefined') {
    return 'Desktop'
  }
  // For 'lg' breakpoint see https://tailwindcss.com/docs/responsive-design
  const tailwindBreakpointLg = window.matchMedia('(min-width: 1024px)')
  return tailwindBreakpointLg.matches ? 'Desktop' : 'Mobile'
}

export const useResponsiveModeStore = defineStore('responsiveMode', () => {
  const responsiveMode = ref<ResponsiveMode>(null)

  if (typeof window !== 'undefined') {
    addEventListener('resize', () => {
      const newResponsiveMode = getResponsiveMode()
      if (newResponsiveMode !== responsiveMode.value) {
        responsiveMode.value = newResponsiveMode
      }
    })
  }

  return { responsiveMode }
})

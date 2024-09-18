export type ResponsiveMode = 'Desktop' | 'Mobile'

const getResponsiveMode = (): ResponsiveMode => {
  // See https://tailwindcss.com/docs/responsive-design
  const tailwindBreakpointLg = window.matchMedia('(min-width: 1024px)')
  return tailwindBreakpointLg.matches ? 'Desktop' : 'Mobile'
}

export const useResponsiveModeStore = defineStore('responsiveMode', () => {
  const responsiveMode = ref<ResponsiveMode>(getResponsiveMode())

  addEventListener('resize', () => {
    const newResponsiveMode = getResponsiveMode()
    if (newResponsiveMode !== responsiveMode.value) {
      responsiveMode.value = newResponsiveMode
    }
  })

  return { responsiveMode }
})

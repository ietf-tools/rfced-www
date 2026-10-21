export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion)').matches

/**
 * Attributes for a Reka `DialogContent` whose `DialogDescription` is not always on screen. Reka
 * points `aria-describedby` at the description whether or not it has rendered, so while it is absent
 * the attribute is dropped, which is Reka's own opt-out.
 */
export const dialogDescriptionAttrs = (isDescribed: boolean): { 'aria-describedby'?: undefined } =>
  isDescribed ? {} : { 'aria-describedby': undefined }

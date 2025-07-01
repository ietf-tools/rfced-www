/**
 * W3C DOMParser factory that works on server and browser
 */
export const getDOMParser = async (): Promise<DOMParser> => {
  // browser environment
  if (typeof window !== 'undefined') {
    return new DOMParser()
  }

  // Node environment... hopefully Nuxt can treeshake JSDOM from clientside
  const jsdomModule = await import('jsdom')
  const { JSDOM } = jsdomModule
  const jsdom = new JSDOM()
  return new jsdom.window.DOMParser()
}

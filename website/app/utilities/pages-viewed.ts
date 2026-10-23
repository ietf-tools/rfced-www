// How many pages the reader has browsed to in this tab, counted from the SPA's own navigations so
// that a full reload starts again from zero. Reef takes it with a survey response as an
// anti-spam signal, so it only has to be roughly right.

// Reef's upper bound for pages_viewed (see ResponseCreate in reef_api.yaml).
const MAX_PAGES_VIEWED = 10_000

let pagesViewed = 0

// `fromPath` is undefined for the first navigation of the app, which lands on a page but leaves
// none. Hash-only and query-only changes stay on the same path, so they aren't another page.
export const recordNavigation = (toPath: string, fromPath: string | undefined) => {
  if (fromPath === undefined || toPath !== fromPath) {
    pagesViewed = Math.min(pagesViewed + 1, MAX_PAGES_VIEWED)
  }
}

// undefined rather than 0 when nothing has been recorded, so a response never claims the reader
// browsed to no pages when the count simply wasn't running.
export const getPagesViewed = (): number | undefined => (pagesViewed === 0 ? undefined : pagesViewed)

export const resetPagesViewed = () => {
  pagesViewed = 0
}

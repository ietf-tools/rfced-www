import { getFeedForLatestRFCs } from '~/utilities/feed'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Content-Type': 'text/xml; charset=utf-8'
  })
  const feed = await getFeedForLatestRFCs(15)
  return feed.atom1()
})

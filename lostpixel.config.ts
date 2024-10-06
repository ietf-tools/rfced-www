/**
 * This is only used on CI
 */

export const config = {
  histoireShots: {
    histoireUrl: './client/.histoire/dist',
    breakpoints: [400, 1024]
  },
  imagePathBaseline: './client/.lostpixel/baseline/',
  imagePathCurrent: './client/.lostpixel/current/',
  imagePathDifference: './client/.lostpixel/difference/',
  generateOnly: true,
  failOnDifference: true
}

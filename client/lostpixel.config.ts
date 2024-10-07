import type { CustomProjectConfig } from 'lost-pixel'

export const config: CustomProjectConfig = {
  histoireShots: {
    histoireUrl: './.histoire/dist',
    breakpoints: [400, 1024]
  },
  generateOnly: true,
  failOnDifference: true
}

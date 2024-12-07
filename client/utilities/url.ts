export const SEARCH_PATH = '/search/' as const

export const SEARCH_API_PATH = '/api/search/' as const

export const rfcPathBuilder = (rfcNumber: number) => `/info/rfc${rfcNumber}/`

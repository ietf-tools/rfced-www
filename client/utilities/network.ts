import { setTimeoutPromise } from './promises'

type FetchOptions = NonNullable<Parameters<typeof fetch>[1]>

export const fetchRetry = (
  url: string,
  delayBetweenRetriesMs: number,
  maxRetries: number,
  fetchOptions?: FetchOptions
) =>
  new Promise<Response>((resolve, reject) => {
    ;(async () => {
      let attemptsRemaining = maxRetries
      const errors: string[] = []
      for (let i = attemptsRemaining; i >= 0; i--) {
        attemptsRemaining--

        try {
          const response = await fetch(url, fetchOptions)
          if (!response.ok) {
            throw Error(`HTTP ${response.status}: ${response.statusText}`)
          }
          resolve(response)
          return
        } catch (e: unknown) {
          errors.push(typeof e === 'object' && e !== null ? e.toString() : '')
          await setTimeoutPromise(delayBetweenRetriesMs)
        }
      }
      reject(errors.join(','))
    })()
  })

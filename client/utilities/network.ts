import { setTimeoutPromise } from './promises'

type FetchOptions = NonNullable<Parameters<typeof fetch>[1]>

export const fetchRetry = (
  url: string,
  delayBetweenRetriesMs: number,
  maxRetries: number,
  fetchOptions?: FetchOptions
) =>
  new Promise<Response>(async (resolve, reject) => {
    let attemptsRemaining = maxRetries
    let errors: string[] = []
    for (let i = attemptsRemaining; i > 0; i--) {
      try {
        const response = await fetch(url, fetchOptions)
        if (!response.ok) {
          throw Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        resolve(response)
        return
      } catch (e: any) {
        errors.push(e.toString())
        await setTimeoutPromise(delayBetweenRetriesMs)
      }
    }
    reject(errors.join(','))
  })

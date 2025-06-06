declare module 'typesense-instantsearch-adapter' {
    export default class SearchAdaptor {
        constructor(args: {
            server: {
                apiKey: string
                nodes: {
                    host: string
                    port: number
                    protocol: 'https'
                    path: string
                }[]
                cacheSearchResultsForSeconds: number
            }
            additionalSearchParameters?: {
                preset: string
            }
        }): void
        searchClient: unknown
    }
}

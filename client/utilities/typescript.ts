// See https://stackoverflow.com/questions/61047551/typescript-union-of-string-and-string-literals
export type HintedString<KnownValues extends string> =
  | (string & {})
  | KnownValues

export const assertNever = (value: never) => {
  throw new Error('Unexpected value: ' + value)
}

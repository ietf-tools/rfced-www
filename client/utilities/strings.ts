export const NONBREAKING_SPACE = '\xa0'
export const SPACE = ' '
export const COMMA = ','

export const splitWordsAt = (
  str: string,
  lineBreakAtChars: number
): string[] => {
  const lines: string[] = []
  let position = 0
  let last = 0
  let line = ''

  let escapeAfterLoops = 1000

  while (position !== -1) {
    escapeAfterLoops--
    // get the string between the last break and this one
    position = str.indexOf(' ', position + 1)

    if (position !== -1) {
      const word = str.slice(last, position)

      if (line.length + word.length > lineBreakAtChars) {
        lines.push(line.trimStart())
        line = ''
      }

      line += word
      last = position
    } else {
      const word = str.slice(last)
      if (line.length + word.length > lineBreakAtChars) {
        lines.push(line.trimStart())
        line = ''
      }
      line += word
    }

    if (escapeAfterLoops < 0) {
      break
    }
  }

  line = line.trimStart()
  if (line.length > 0) {
    lines.push(line)
  }

  return lines
}

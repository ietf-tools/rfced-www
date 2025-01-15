export const NONBREAKING_SPACE = '\xa0'
export const SPACE = ' '
export const COMMA = ','

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const splitWordsAt = (str: string, lineLength: number): string[] => {
  const lines: string[] = []
  let remainingStr = str
  let position = 0

  while (remainingStr.length > lineLength) {
    // get the string between the last break and this one
    position = remainingStr.lastIndexOf(SPACE, lineLength)

    if (position !== -1) {
      lines.push(remainingStr.substring(0, position).trim())
      remainingStr = remainingStr.substring(position + 1)
    }
  }

  lines.push(remainingStr.trim())

  return lines
}

// export const splitWordsAt = (str: string, lineLength: number): string[] => {
//   const lines: string[] = []
//   let position = 0
//   let last = position
//   let line = ''

//   while (position !== -1) {
//     // get the string between the last break and this one
//     position = str.indexOf(' ', position + 1)

//     if (position !== -1) {
//       const word = str.slice(last, position)

//       if (`${line}${word}`.trim().length > lineLength) {
//         lines.push(line.trim())
//         line = ''
//       }

//       line += word
//       last = position
//     } else {
//       const word = str.slice(last)
//       if (line.length + word.length > lineLength) {
//         lines.push(line.trim())
//         line = ''
//       }
//       line += word
//     }
//   }

//   line = line.trim()
//   if (line.length > 0) {
//     lines.push(line.trim())
//   }

//   return lines
// }

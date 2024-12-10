type RFCId = {
  type: string | typeof RFC
  number: string
  title?: string
}

export const RFC = 'RFC'

const NonBreakingSpace = '\xa0'

export const parseRFCId = (title: string): RFCId => {
  // split by groups of letters or numbers
  // ie "RFC0000" becomes ["RFC", "0000"]
  const parts = title.match(/\d+|\D+/g)

  if (parts?.length === 2) {
    return {
      type: parts[0].toUpperCase(),
      number: parts[1]
    }
  }

  if (parts?.length === 3) {
    return {
      type: parts[0].toUpperCase(),
      number: parts[1],
      title: parts[2]
    }
  }

  return {
    type: 'unknown',
    number: title
  }
}

/**
 * Formats a string of 'RFCnumber' with non-bold/bold text with an NBSP between
 * Returns h() Component for rendering
 */
export const formatTitle = (rfcId: string) => {
  const parts = parseRFCId(rfcId)

  return h('span', [
    h('span', { class: 'font-normal' }, parts.type),
    NonBreakingSpace,
    h('span', { class: 'bold' }, parts.number)
  ])
}

/**
 * Formats a string of 'RFCnumber' as plain text with an NBSP between
 */
export const formatTitlePlaintext = (title: string) => {
  const parts = parseRFCId(title)

  return `${parts.type}${NonBreakingSpace}${parts.number}`
}

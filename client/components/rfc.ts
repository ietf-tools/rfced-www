type RFCId = {
  type: string | typeof RFC
  number: string
  title?: string
}

export const RFC = 'RFC'

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

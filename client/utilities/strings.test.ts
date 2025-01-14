// @vitest-environment nuxt
import { test, expect } from 'vitest'
import { splitWordsAt } from './strings'

const paragraph =
  'Obsoletes xxxx refers to other RFCs that this one replaces; Obsoleted by xxxx refers to RFCs that have replaced this one. Updates xxxx refers to other RFCs that this one merely updates (but does not replace);'

test('splitWordsAt: 40', () => {
  expect(splitWordsAt(paragraph, 40)).toEqual([
    'Obsoletes xxxx refers to other RFCs that',
    'this one replaces; Obsoleted by xxxx',
    'refers to RFCs that have replaced this',
    'one. Updates xxxx refers to other RFCs',
    'that this one merely updates (but does',
    'not replace);'
  ])
})

test('splitWordsAt: 50', () => {
  expect(splitWordsAt(paragraph, 50)).toEqual([
    'Obsoletes xxxx refers to other RFCs that this one',
    'replaces; Obsoleted by xxxx refers to RFCs that',
    'have replaced this one. Updates xxxx refers to',
    'other RFCs that this one merely updates (but does',
    'not replace);'
  ])
})

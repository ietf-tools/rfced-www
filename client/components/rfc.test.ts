// @vitest-environment nuxt
import { test, expect } from 'vitest'
import { parseRFCId, NonBreakingSpace } from './rfc'
import type { Rfc } from '../generated/red-client'

test('parseRFCId', () => {
  expect(parseRFCId('rfc1234')).toEqual({
    type: 'RFC',
    number: '1234'
  })

  expect(parseRFCId('rfc1234bub')).toEqual({
    type: 'RFC',
    number: '1234',
    title: 'bub'
  })

  expect(parseRFCId(`rfc${NonBreakingSpace}1234`)).toEqual({
    type: 'RFC',
    number: '1234'
  })
})

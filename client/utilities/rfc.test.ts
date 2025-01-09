// @vitest-environment nuxt
import { test, expect } from 'vitest'
import { parseRFCId } from './rfc'
import { NONBREAKING_SPACE } from './strings'

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

  expect(parseRFCId(`rfc${NONBREAKING_SPACE}1234`)).toEqual({
    type: 'RFC',
    number: '1234'
  })
})

// @vitest-environment nuxt
import { test, expect } from 'vitest'
import { rfcCitePathBuilder } from './url'

test('rfcCitePathBuilder: txt', () => {
  expect(rfcCitePathBuilder('rfc9000', 'txt')).toEqual(
    'https://www.rfc-editor.org/refs/rfc9000.txt'
  )
  expect(rfcCitePathBuilder('RFC9000', 'txt')).toEqual(
    'https://www.rfc-editor.org/refs/rfc9000.txt'
  )
})

test('rfcCitePathBuilder: xml', () => {
  expect(rfcCitePathBuilder('rfc9000', 'xml')).toEqual(
    'https://bib.ietf.org/public/rfc/bibxml/reference.RFC.9000.xml'
  )
  expect(rfcCitePathBuilder('RFC9000', 'xml')).toEqual(
    'https://bib.ietf.org/public/rfc/bibxml/reference.RFC.9000.xml'
  )
})

test('rfcCitePathBuilder: bibTeX', () => {
  expect(rfcCitePathBuilder('rfc9000', 'bibTeX')).toEqual(
    'https://datatracker.ietf.org/doc/rfc9000/bibtex/'
  )
  expect(rfcCitePathBuilder('RFC9000', 'bibTeX')).toEqual(
    'https://datatracker.ietf.org/doc/rfc9000/bibtex/'
  )
})

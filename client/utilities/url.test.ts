// @vitest-environment nuxt
import { test, expect } from 'vitest'
import {
  IETF_PRIVACY_STATEMENT_URL,
  rfcCitePathBuilder,
  rfcFormatPathBuilder,
  textToAnchorId,
  isExternalLink,
  isInternalLink,
  isMailToLink,
  parseMaybeRfcLink
} from './url'

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

test('rfcFormatPathBuilder: html', () => {
  expect(rfcFormatPathBuilder('rfc9000', 'html')).toEqual(
    'https://www.rfc-editor.org/rfc/rfc9000.html'
  )
  expect(rfcFormatPathBuilder('RFC9000', 'html')).toEqual(
    'https://www.rfc-editor.org/rfc/rfc9000.html'
  )
})

test('textToAnchorId', () => {
  expect(
    textToAnchorId('What Sort Of Documents Are Independent Submissions?')
  ).toEqual('what-sort-of-documents-are-independent-submissions')

  expect(
    textToAnchorId('Some RFCs') // testing to ensure it doesn't turn 'RFCs' into 'rf-cs' which can happen with incorrect usage of kebabCase
  ).toEqual('some-rfcs')

  expect(
    textToAnchorId('Section 2.2') // testing to ensure it doesn't turn "2.2" into "22" which wouldn't be easy to read as an anchor id.
  ).toEqual('section-2-2')
})

test('isExternalLink', () => {
  expect(isExternalLink(undefined)).toEqual(true)
  expect(isExternalLink('/something')).toEqual(false)
  expect(isExternalLink('#something')).toEqual(false)
  expect(isExternalLink('http://')).toEqual(true)
  expect(isExternalLink('https://')).toEqual(true)
  expect(isExternalLink(IETF_PRIVACY_STATEMENT_URL)).toEqual(true)
})

test('isInternalLink', () => {
  expect(isInternalLink(undefined)).toEqual(false)
  expect(isInternalLink('/something')).toEqual(true)
  expect(isInternalLink('#something')).toEqual(true)
  expect(isInternalLink('http://')).toEqual(false)
  expect(isInternalLink('https://')).toEqual(false)
  expect(isInternalLink(IETF_PRIVACY_STATEMENT_URL)).toEqual(false)
})

test('isMailToLink', () => {
  expect(isMailToLink(undefined)).toEqual(false)
  expect(isMailToLink('/something')).toEqual(false)
  expect(isMailToLink('#something')).toEqual(false)
  expect(isMailToLink('http://')).toEqual(false)
  expect(isMailToLink('https://')).toEqual(false)
  expect(isMailToLink(IETF_PRIVACY_STATEMENT_URL)).toEqual(false)
  expect(
    isMailToLink(
      // with a leading space, should not match
      ' mailto:user@example.com'
    )
  ).toEqual(false)

  expect(isMailToLink('mailto:user@example.com')).toEqual(true)
})

test('parseMaybeRfcLink', () => {
  expect(parseMaybeRfcLink('something/rfc1/something-else')).toEqual({
    type: 'RFC',
    number: '1'
  })

  expect(parseMaybeRfcLink('/rfc/rfc10101')).toEqual({
    type: 'RFC',
    number: '10101'
  })
})

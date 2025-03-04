# CHANGE LOG

## 2025 March 4

### Upcoming API changes

Great care has been taken to ensure consistency with previous API formats where possible. There are substantial unit tests to verify that the same data is being served, except for changes deemed necessary for future compatibility. Developers using rfc-editor.org APIs should read the following document and adjust their code accordingly.

These changes apply to **all** APIs (_global API changes_):

1. **5 digit RFC numbers** (AKA the RFC10k issue). Due to this RFC ids in API responses no longer have leading zeros (eg RFC0500 becomes RFC500), except for DOI ids which remain unchanged. Software parsing should expect 1-5+ digits and not assume that RFCs have 4 digits.
2. **Trailing slash URL changes.** URLs in API responses that link to HTML pages will have trailing slashes (if they didn't already). For example https://www.rfc-editor.org/info/rfc9000 becomes https://www.rfc-editor.org/info/rfc9000/ (note the trailing slash). This has been done for consistency.
3. **Redirects** generally speaking we don't want to change URLs, but if the URL changes there will always be HTTP redirects to the new URL. Consumers of our APIs should ensure their HTTP client is configured to follow redirects. For example, by default `wget` follows redirects but `curl` does not. These redirects _may_ go to `static.rfc-editor.org`.

#### `/rfc-index.txt`

The global changes, and the table layout of this file must change to make space for 5 digit RFCs. Here's [a sample file of the new `rfc-index.txt` (truncated to RFC19)](https://github.com/ietf-tools/rfced-www/blob/main/client/utilities/rfc-5digit-index.txt) (compare against [the 4 digit](https://github.com/ietf-tools/rfced-www/blob/main/client/utilities/rfc-4digit-index.txt) which has a narrower column). No redirect is expected.

#### `/rfc-index.xml`

The global changes. Here's [a sample file of the new `rfc-index.xml`](https://raw.githubusercontent.com/ietf-tools/rfced-www/refs/heads/main/client/utilities/rfc-index.xml). No redirect is expected. The `/rfc-index.xsd` file will remain.

#### `/rfcrss.xml` and `/rfcatom.xml`

The generated feeds aren't identical as the new feed generator uses `<![CDATA[]]>` escaping but compliant RSS/ATOM clients should handle this. For the developer details see [#27](https://github.com/ietf-tools/rfced-www/pull/27). The global API changes apply to this API too. No redirects are expected.

TODO: sample files

#### `/rfc/rfc*.json`
(where * is a valid RFC number. For example, [rfc9000.json](https://www.rfc-editor.org/rfc/rfc9000.json))

In earlier RFC JSON files (approximately RFC1-RFC4039) there's extra whitespace in earlier RFCs. For example, [rfc10.json](https://www.rfc-editor.org/rfc/rfc10.json) has an extra space character before and after the `title`, `abstract`, and `keywords`. This whitespace wasn't present in equivalent APIs like `/rfc-index.xml`, and this whitespace will be removed in the new version of the API.  The global API changes apply to this API too. No redirects are expected for this API.

TODO: sample files

#### HTML pages

Consumers that scrapes rfc-editor.org HTML pages should expect a different HTML structure when the new site is released. This is necessary for the new graphic design. No guarantees about maintaining HTML structure can be made and further changes may occur even after the release of the site. We recommend that software migrate to JSON or XML APIs instead of scraping HTML as this will be more resilient against these design changes.

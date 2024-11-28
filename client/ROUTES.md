# Audit of existing rfc-editor.org routes

## All routes except RFCs

| Path                                                                                                                                 | Redirect                                 | Notes                                                                                                                        |
| :----------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [/](https://www.rfc-editor.org/)                                                                                                     |                                          |                                                                                                                              |
| [/rfc-index.txt](https://www.rfc-editor.org/rfc-index.txt)                                                                           |                                          |
| [/rfc-index-100a.html](https://www.rfc-editor.org/rfc-index-100a.html)                                                               |                                          |
| [/rfc-index.html](https://www.rfc-editor.org/rfc-index.html)                                                                         |                                          |
| [/rfc-index2.html](https://www.rfc-editor.org/rfc-index2.html)                                                                       |                                          |
| [/rfcrss.xml](https://www.rfc-editor.org/rfcrss.xml)                                                                                 |                                          |
| [/rfcatom.xml](https://www.rfc-editor.org/rfcatom.xml)                                                                               |                                          |
| [/rfc-index.xml](https://www.rfc-editor.org/rfc-index.xml)                                                                           |                                          |
| [/rfc-index.xsd](https://www.rfc-editor.org/rfc-index.xsd)                                                                           |                                          |
| [/search](https://www.rfc-editor.org/search)                                                                                         | /search/rfc_search/                      | Do we merge rfc_search.php and rfc_search_detail.php routes into eg `/search/rfc_search` or are there distinct search pages? |
| [/search/rfc_search.php](https://www.rfc-editor.org/search/rfc_search.php)                                                           | /search/rfc_search/ (convert params too) |
| [/search/rfc_search_detail.php?title=DHCPv4&page=All](https://www.rfc-editor.org/search/rfc_search_detail.php?title=DHCPv4&page=All) | /search/rfc_search_detail/               |
| [/status_changes.php](https://www.rfc-editor.org/status_changes.php)                                                                 |                                          |
| [/contact/](https://www.rfc-editor.org/contact/)                                                                                     |                                          |
| [/other/](https://www.rfc-editor.org/other/)                                                                                         |                                          |
| [/report-summary/](https://www.rfc-editor.org/report-summary/)                                                                       |                                          |
| [/sitemap/](https://www.rfc-editor.org/sitemap/)                                                                                     |                                          |
| [/about/](https://www.rfc-editor.org/about/)                                                                                         |                                          |
| [/about/governing/](https://www.rfc-editor.org/about/governing/)                                                                     |                                          |
| [/about/independent/](https://www.rfc-editor.org/about/independent/)                                                                 |                                          |
| [/about/iseb/](https://www.rfc-editor.org/about/iseb/)                                                                               |                                          |
| [/about/clusters](https://www.rfc-editor.org/about/clusters)                                                                         |                                          |
| [/about/search/](https://www.rfc-editor.org/about/search/)                                                                           |                                          |
| [/all_clusters.php](https://www.rfc-editor.org/all_clusters.php)                                                                     | /all_clusters/                           |
| [/reports/CurrQstats.txt](https://www.rfc-editor.org/reports/CurrQstats.txt)                                                         |                                          |
| [/retrieve/](https://www.rfc-editor.org/retrieve/)                                                                                   |                                          |
| [/retrieve/bulk/](https://www.rfc-editor.org/retrieve/bulk/)                                                                         |                                          |
| [/standards](https://www.rfc-editor.org/standards)                                                                                   | /standards/                              |
| [/errata.php](https://www.rfc-editor.org/errata.php)                                                                                 | /errata/                                 |
| [/source-definitions](https://www.rfc-editor.org/source-definitions)                                                                 | /source-definitions/                     |
| [/how-to-verify](https://www.rfc-editor.org/how-to-verify)                                                                           | /how-to-verify/                          |
| [/faq/](https://www.rfc-editor.org/faq/)                                                                                             |                                          |
| [/history/](https://www.rfc-editor.org/history/)                                                                                     |                                          |
| [/museum/](https://www.rfc-editor.org/in-notes/museum/)                                                                              |                                          |
| [/ien/ien-index.html](https://www.rfc-editor.org/ien/ien-index.html)                                                                 | /ien/ien-index/                          |
| [/never-issued/](https://www.rfc-editor.org/never-issued/)                                                                           |                                          |
| [/pubprocess/](https://www.rfc-editor.org/pubprocess/)                                                                               |                                          |
| [/about/pubprocess](https://www.rfc-editor.org/about/pubprocess)                                                                     |                                          |
| [/pubprocess/auth48/](https://www.rfc-editor.org/pubprocess/auth48/)                                                                 |                                          |
| [/current_queue.php](https://www.rfc-editor.org/current_queue.php)                                                                   | /current_queue/                          |
| [/about/queue/](https://www.rfc-editor.org/about/queue/)                                                                             |                                          |
| [/contact/at-ietf/](https://www.rfc-editor.org/contact/at-ietf/)                                                                     |                                          |
| [/queue2.xml](https://www.rfc-editor.org/queue2.xml)                                                                                 |                                          |
| [/queue.xml](https://www.rfc-editor.org/queue.xml)                                                                                   |                                          |
| [/about/queue/flowchart/](https://www.rfc-editor.org/about/queue/flowchart/)                                                         |                                          |
| [/in-notes/rfc-ref.txt](https://www.rfc-editor.org/in-notes/rfc-ref.txt)                                                             |                                          |
| [/styleguide/](https://www.rfc-editor.org/styleguide/)                                                                               |                                          |
| [/styleguide/part2/](https://www.rfc-editor.org/styleguide/part2/)                                                                   |                                          |
| [/styleguide/tips/](https://www.rfc-editor.org/styleguide/tips/)                                                                     |                                          |

## RFC routes

| Path                                                                                 | Redirect         |
| :----------------------------------------------------------------------------------- | :--------------- |
| [/info/rfc5492](https://www.rfc-editor.org/info/rfc5492)                             | /info/rfc5492/   |
| [/rfc/rfc5492.txt](https://www.rfc-editor.org/rfc/rfc5492.txt)                       |                  |
| [/rfc/pdfrfc/rfc5492.txt.pdf](https://www.rfc-editor.org/rfc/pdfrfc/rfc5492.txt.pdf) |                  |
| [/refs/ref5492.txt](https://www.rfc-editor.org/refs/ref5492.txt)                     |                  |
| [/errata/rfc5492](https://www.rfc-editor.org/errata/rfc5492)                         | /errata/rfc5492/ |

## Bulk routes

- [/retrieve/bulk/](https://www.rfc-editor.org/retrieve/bulk/)
- All
  - [/in-notes/tar/RFC-all.tar.gz (TXT)](https://www.rfc-editor.org/in-notes/tar/RFC-all.tar.gz)
  - [/in-notes/tar/RFC-all.zip (TXT)](https://www.rfc-editor.org/in-notes/tar/RFC-all.zip)
  - [/in-notes/tar/pdfrfc-all.tar.gz (PDF)](https://www.rfc-editor.org/in-notes/tar/pdfrfc-all.tar.gz)
  - [/in-notes/tar/pdfrfc-all.zip (PDF)](https://www.rfc-editor.org/in-notes/tar/pdfrfc-all.zip)
  - [/in-notes/tar/xmlsource-all.tar.gz (XML)](https://www.rfc-editor.org/in-notes/tar/xmlsource-all.tar.gz)
  - [/in-notes/tar/xmlsource-all.zip (XML)](https://www.rfc-editor.org/in-notes/tar/xmlsource-all.zip)
- 8501-latest
  - [/in-notes/tar/RFCs8501-latest.tar.gz (TXT)](https://www.rfc-editor.org/in-notes/tar/RFCs8501-latest.tar.gz)
  - [/in-notes/tar/RFCs8501-latest.zip (TXT)](https://www.rfc-editor.org/in-notes/tar/RFCs8501-latest.zip)
  - [/in-notes/tar/pdfrfc8501-latest.tar.gz (PDF)](https://www.rfc-editor.org/in-notes/tar/pdfrfc8501-latest.tar.gz)
  - [/in-notes/tar/pdfrfc8501-latest.zip (PDF)](https://www.rfc-editor.org/in-notes/tar/pdfrfc8501-latest.zip)
  - [/in-notes/tar/xmlsource-rfc8650-latest.tar.gz (XML)](https://www.rfc-editor.org/in-notes/tar/xmlsource-rfc8650-latest.tar.gz)
  - [/in-notes/tar/xmlsource-rfc8650-latest.zip (XML)](https://www.rfc-editor.org/in-notes/tar/xmlsource-rfc8650-latest.zip)
- Ranges
  - [/in-notes/tar/RFCs8001-8500.tar.gz (TXT)](https://www.rfc-editor.org/in-notes/tar/RFCs8001-8500.tar.gz)
  - [/in-notes/tar/RFCs8001-8500.zip (TXT)](https://www.rfc-editor.org/in-notes/tar/RFCs8001-8500.zip)
  - [/in-notes/tar/pdfrfc8001-8500.tar.gz (PDF)](https://www.rfc-editor.org/in-notes/tar/pdfrfc8001-8500.tar.gz)
  - [/in-notes/tar/pdfrfc8001-8500.zip (PDF)](https://www.rfc-editor.org/in-notes/tar/pdfrfc8001-8500.zip)

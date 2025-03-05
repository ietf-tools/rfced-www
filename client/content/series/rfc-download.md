# Download RFCs (/series/rfc-download/) {#download-rfcs-(/series/rfc-download/)}

### Feed of recently published RFCs

To be notified of newly published RFCs, use the [RSS feed](/rfcrss.xml) or [Atom feed](/rfcatom.xml).

### Download RFCs Using rsync

To download RFCs and keep them up to date locally, use [rsync](http://rsync.samba.org).

#### To get the list of modules available type rsync rsync.rfc-editor.org:: This will return the following results:

| Module Names      | Comments                                                            |
| :---------------- | :------------------------------------------------------------------ |
| everything-ftp    | Everything FTP                                                      |
| rfcs              | Contents of in-notes/ and subdirectories bcp/, fyi/, ien/, and std/ |
| rfcs-text-only    | Text files from \[rfcs\]                                            |
| rfc-ed-all        | Entire repository (excluding Internet-Drafts)                       |
| rfcs-pdf-only     | PDF versions of ASCII RFCs to ensure correct page breaks, etc.      |
| rfcs-exclude-json | Contents of \[rfcs\] excluding JSON files                           |
| rfcs-json-only    | Only the JSON files from the directories in \[rfcs\]                |

#### To create a mirror using a module

Type rsync \-avz \--delete rsync.rfc-editor.org::Module-Name Target-Directory

For example: To create a mirror of the text versions of all the RFCs, i.e.,  
in-notes/\*.txt  
in-notes/bcp/\*.txt  
in-notes/fyi/\*.txt  
in-notes/ien/\*.txt  
in-notes/std/\*.txt

type rsync \-avz \--delete rsync.rfc-editor.org::rfcs-text-only my-rfc-mirror

(The \--delete option is useful for removing local copies of files that have been deleted from the repository as well as expired Internet-Drafts.)

### Download RFCs in TAR or ZIP Files

RFCs are available in three file formats: TXT, PDF, and XML. The XML format is only available for RFC 8650 and later.

|                             | TXT                                                                                     | PDF                                                                                         | XML                                                                                 |
| :-------------------------- | :-------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------- |
| All RFCs                    | [TAR](/in-notes/tar/RFC-all.tar.gz) or [ZIP](/in-notes/tar/RFC-all.zip)                 | [TAR](/in-notes/tar/pdfrfc-all.tar.gz) or [ZIP](/in-notes/tar/pdfrfc-all.zip)               |                                                                                     |
| RFC 8650 \- latest (in XML) |                                                                                         |                                                                                             | [TAR](/in-notes/tar/xmlsource-all.tar.gz) or [ZIP](/in-notes/tar/xmlsource-all.zip) |
| RFC 8501- latest            | [TAR](/in-notes/tar/RFCs8501-latest.tar.gz) or [ZIP](/in-notes/tar/RFCs8501-latest.zip) | [TAR](/in-notes/tar/pdfrfc8501-latest.tar.gz) or [ZIP](/in-notes/tar/pdfrfc8501-latest.zip) |                                                                                     |
| RFC 8001 \- 8500            | [TAR](/in-notes/tar/RFCs8001-8500.tar.gz) or [ZIP](/in-notes/tar/RFCs8001-8500.zip)     | [TAR](/in-notes/tar/pdfrfc8001-8500.tar.gz) or [ZIP](/in-notes/tar/pdfrfc8001-8500.zip)     |                                                                                     |
| RFC 7501 – 8000             | [TAR](/in-notes/tar/RFCs7501-8000.tar.gz) or [ZIP](/in-notes/tar/RFCs7501-8000.zip)     | [TAR](/in-notes/tar/pdfrfc7501-8000.tar.gz) or [ZIP](/in-notes/tar/pdfrfc7501-8000.zip)     |                                                                                     |
| RFC 7001 – 7500             | [TAR](/in-notes/tar/RFCs7001-7500.tar.gz) or [ZIP](/in-notes/tar/RFCs7001-7500.zip)     | [TAR](/in-notes/tar/pdfrfc7001-7500.tar.gz) or [ZIP](/in-notes/tar/pdfrfc7001-7500.zip)     |                                                                                     |
| RFC 6501 – 7000             | [TAR](/in-notes/tar/RFCs6501-7000.tar.gz) or [ZIP](/in-notes/tar/RFCs6501-7000.zip)     | [TAR](/in-notes/tar/pdfrfc6501-7000.tar.gz) or [ZIP](/in-notes/tar/pdfrfc6501-7000.zip)     |                                                                                     |
| RFC 6001 – 6500             | [TAR](/in-notes/tar/RFCs6001-6500.tar.gz) or [ZIP](/in-notes/tar/RFCs6001-6500.zip)     | [TAR](/in-notes/tar/pdfrfc6001-6500.tar.gz) or [ZIP](/in-notes/tar/pdfrfc6001-6500.zip)     |                                                                                     |
| RFC 5501 – 6000             | [TAR](/in-notes/tar/RFCs5501-6000.tar.gz) or [ZIP](/in-notes/tar/RFCs5501-6000.zip)     | [TAR](/in-notes/tar/pdfrfc5501-6000.tar.gz) or [ZIP](/in-notes/tar/pdfrfc5501-6000.zip)     |                                                                                     |
| RFC 5001 – 5500             | [TAR](/in-notes/tar/RFCs5001-5500.tar.gz) or [ZIP](/in-notes/tar/RFCs5001-5500.zip)     | [TAR](/in-notes/tar/pdfrfc5001-5500.tar.gz) or [ZIP](/in-notes/tar/pdfrfc5001-5500.zip)     |                                                                                     |
| RFC 4501 – 5000             | [TAR](/in-notes/tar/RFCs4501-5000.tar.gz) or [ZIP](/in-notes/tar/RFCs4501-5000.zip)     | [TAR](/in-notes/tar/pdfrfc4501-5000.tar.gz) or [ZIP](/in-notes/tar/pdfrfc4501-5000.zip)     |                                                                                     |
| RFC 4001 – 4500             | [TAR](/in-notes/tar/RFCs4001-4500.tar.gz) or [ZIP](/in-notes/tar/RFCs4001-4500.zip)     | [TAR](/in-notes/tar/pdfrfc4001-4500.tar.gz) or [ZIP](/in-notes/tar/pdfrfc4001-4500.zip)     |                                                                                     |
| RFC 3501 – 4000             | [TAR](/in-notes/tar/RFCs3501-4000.tar.gz) or [ZIP](/in-notes/tar/RFCs3501-4000.zip)     | [TAR](/in-notes/tar/pdfrfc3501-4000.tar.gz) or [ZIP](/in-notes/tar/pdfrfc3501-4000.zip)     |                                                                                     |
| RFC 3001 – 3500             | [TAR](/in-notes/tar/RFCs3001-3500.tar.gz) or [ZIP](/in-notes/tar/RFCs3001-3500.zip)     | [TAR](/in-notes/tar/pdfrfc3001-3500.tar.gz) or [ZIP](/in-notes/tar/pdfrfc3001-3500.zip)     |                                                                                     |
| RFC 2501 – 3000             | [TAR](/in-notes/tar/RFCs2501-3000.tar.gz) or [ZIP](/in-notes/tar/RFCs2501-3000.zip)     | [TAR](/in-notes/tar/pdfrfc2501-3000.tar.gz) or [ZIP](/in-notes/tar/pdfrfc2501-3000.zip)     |                                                                                     |
| RFC 2001 – 2500             | [TAR](/in-notes/tar/RFCs2001-2500.tar.gz) or [ZIP](/in-notes/tar/RFCs2001-2500.zip)     | [TAR](/in-notes/tar/pdfrfc2001-2500.tar.gz) or [ZIP](/in-notes/tar/pdfrfc2001-2500.zip)     |                                                                                     |
| RFC 1501 – 2000             | [TAR](/in-notes/tar/RFCs1501-2000.tar.gz) or [ZIP](/in-notes/tar/RFCs1501-2000.zip)     | [TAR](/in-notes/tar/pdfrfc1501-2000.tar.gz) or [ZIP](/in-notes/tar/pdfrfc1501-2000.zip)     |                                                                                     |
| RFC 1001 – 1500             | [TAR](/in-notes/tar/RFCs1001-1500.tar.gz) or [ZIP](/in-notes/tar/RFCs1001-1500.zip)     | [TAR](/in-notes/tar/pdfrfc1001-1500.tar.gz) or [ZIP](/in-notes/tar/pdfrfc1001-1500.zip)     |                                                                                     |
| RFC 501 – 1000              | [TAR](/in-notes/tar/RFCs0501-1000.tar.gz) or [ZIP](/in-notes/tar/RFCs0501-1000.zip)     | [TAR](/in-notes/tar/pdfrfc0501-1000.tar.gz) or [ZIP](/in-notes/tar/pdfrfc0501-1000.zip)     |                                                                                     |
| RFC 1 – 500                 | [TAR](/in-notes/tar/RFCs0001-0500.tar.gz) or [ZIP](/in-notes/tar/RFCs0001-0500.zip)     | [TAR](/in-notes/tar/pdfrfc0001-0500.tar.gz) or [ZIP](/in-notes/tar/pdfrfc0001-0500.zip)     |                                                                                     |

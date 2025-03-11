import {
  IETF_PRIVACY_STATEMENT_URL,
  markdownPathBuilder,
  searchPathBuilder
} from '~/utilities/url'

type MenuItemChild = {
  label: string
  click?: () => void
  href?: string
  children?: MenuItemChild[]
}

type MenuItem = {
  label: string
  children: MenuItemChild[]
}

export const colorPreferences = [
  { value: 'system', label: 'System default' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' }
]

export const menuData: MenuItem[] = [
  {
    label: 'The RFC Series',
    children: [
      { label: 'What is an RFC?', href: markdownPathBuilder('/series/rfc/') },
      {
        label: 'How can I use RFCs?',
        href: markdownPathBuilder('/series/rfc/')
      },
      {
        label: 'Tips for reading RFCs',
        href: markdownPathBuilder('/series/rfc-tips/')
      },
      {
        label: 'Browse RFCs by Status:',
        children: [
          {
            label: 'Standards',
            href: searchPathBuilder({ statuses: 'standards' })
          },
          {
            label: 'Best Current Practices (BCP)',
            href: searchPathBuilder({ statuses: 'bcp' })
          },
          {
            label: 'Informational',
            href: searchPathBuilder({ statuses: 'informational' })
          },
          {
            label: 'Experimental',
            href: searchPathBuilder({ statuses: 'experimental' })
          },
          {
            label: 'Historic',
            href: searchPathBuilder({ statuses: 'historic' })
          },
          {
            label: 'Uncategorized',
            href: searchPathBuilder({ statuses: 'uncategorized' })
          }
        ]
      },
      {
        label: 'Download RFCs',
        href: markdownPathBuilder('/series/rfc-download/')
      },
      {
        label: 'Errata in RFCs',
        href: markdownPathBuilder('/series/rfc-errata/')
      },
      {
        label: 'FAQ',
        href: markdownPathBuilder('/series/rfc-faq/')
      }
    ]
  },
  {
    label: 'For Authors',
    children: [
      {
        label: 'How to write an RFC',
        href: markdownPathBuilder('/authors/rfc-how-to/')
      },
      {
        label: 'Independent Submissions',
        href: markdownPathBuilder('/authors/rfc-independent-submissions/')
      },
      {
        label: 'RFC Editorial Process',
        href: markdownPathBuilder('/authors/rfc-edit/'),
        children: [
          {
            label: 'Current Publication Queue',
            href: markdownPathBuilder('/authors/rfc-edit/pub-queue/')
          },
          {
            label: 'Document Clusters in Queue',
            href: markdownPathBuilder('/authors/rfc-edit/doc-clusters/')
          },
          {
            label: 'Authors Final Review (AUTH48)',
            href: markdownPathBuilder('/authors/rfc-edit/auth48/')
          }
        ]
      },
      {
        label: 'Style Guide',
        href: markdownPathBuilder('/authors/rfc-style-guide/')
      }
    ]
  },
  {
    label: 'About Us',
    children: [
      {
        label: 'About RFC Editor',
        href: markdownPathBuilder('/about/rfc-editor/')
      },
      {
        label: 'Reports',
        href: markdownPathBuilder('/about/rpc-reports/')
      },
      {
        label: 'Privacy Statement',
        href: IETF_PRIVACY_STATEMENT_URL
      },
      {
        label: 'Contact',
        href: markdownPathBuilder('/about/contact/')
      }
    ]
  }
]

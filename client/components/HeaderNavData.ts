type MenuItem = {
  label: string
  children: { label: string; href: string; click?: () => void }[]
}

export const colorPreferences = [
  { value: 'system', label: 'System default' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'sepia', label: 'Sepia' }
]

export const menuData: MenuItem[] = [
  {
    label: 'Documents',
    children: [
      { label: 'menu item a', href: '/a' },
      { label: 'menu item b', href: '/b' }
    ]
  },
  {
    label: 'About RFCs',
    children: [
      { label: 'menu item a', href: '/a' },
      { label: 'menu item b', href: '/b' }
    ]
  },
  {
    label: 'Authoring',
    children: [
      { label: 'menu item a', href: '/a' },
      { label: 'menu item b', href: '/b' }
    ]
  },
  {
    label: 'Reports',
    children: [
      { label: 'a', href: '/a' },
      { label: 'b', href: '/b' }
    ]
  }
]

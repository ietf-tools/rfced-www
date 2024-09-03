type MenuItem = {
  label: string
  children: { label: string; href: string }[]
}

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

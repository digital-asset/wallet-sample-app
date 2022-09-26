export interface MenuItem {
  label: string,
  path: string
}

export const drawerWidth = 200;

export const menuItems: MenuItem[] = [
  { label: 'My Asset Accounts', path: '/' },
  { label: 'Pending Activities', path: '/pending' }, 
  {
    label: 'Create', path: '/create'
  },
  {
    label: "Transaction History", path:'/transactions'
  }
]

export const sideMenuSx = {
  width: drawerWidth,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
}
export const helpMenuDrawerSx = {
  width: 400,
  flexShrink: 0,
  zIndex: 0,
  [`& .MuiDrawer-paper`]: { width: 300, boxSizing: "border-box" },
}
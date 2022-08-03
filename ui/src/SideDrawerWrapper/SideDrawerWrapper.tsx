import React from 'react'
import { helpMenuDrawerSx, sideMenuSx } from '../configs/sideMenu.config';
import { Drawer, Toolbar } from '@mui/material';


interface SideDrawerProps {
  anchor: "left" | "top" | "right" | "bottom" | undefined
  isOpen: boolean;
  handleDrawerClose: () => void;
}
export const SideDrawerWrapper: React.FC<SideDrawerProps> = ({children, anchor, isOpen, handleDrawerClose}) => {
  return (
    <Drawer
      anchor={anchor}
      open={isOpen}
      variant='temporary'
      onClose={handleDrawerClose}
      sx={anchor === 'left' ?sideMenuSx: helpMenuDrawerSx}
      keepMounted={true}
      
    >
      <Toolbar/>
      {children}
    </Drawer>

  )
}
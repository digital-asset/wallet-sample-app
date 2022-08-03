import React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import { Drawer } from "@mui/material";
import { WelcomeMessage } from "../WelcomeMessage/WelcomeMessage";
import { GettingStartedMessage } from "../GettingStartedMessage/GettingStarted";

const drawerWidth: string = "30%";

interface SideMenuMobileProps {
  isOpen: boolean;
}
export const RightDrawer: React.FC<SideMenuMobileProps> = ({ isOpen }) => {
  return (
    <Drawer
      open={isOpen}
      variant="persistent"
      anchor="right"
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflowY: "auto" }}>
        <WelcomeMessage />
        <GettingStartedMessage />
      </Box>
    </Drawer>
  );
};

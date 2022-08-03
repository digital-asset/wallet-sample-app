import React from "react";
import { SideDrawerWrapper } from "../../SideDrawerWrapper/SideDrawerWrapper";

import { SideMenuContent } from "../SideMenuContent/SideMenuContent";
interface SideMenuMobileProps {
  isOpen: boolean;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
}
export const SideMenuMobile: React.FC<SideMenuMobileProps> = ({
  isOpen,
  handleDrawerClose,
}) => {
  return (
    <SideDrawerWrapper
      anchor={"left"}
      isOpen={isOpen}
      handleDrawerClose={handleDrawerClose}
    >
      <SideMenuContent handleDrawerClose={handleDrawerClose} />
    </SideDrawerWrapper>
  );
};

import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { IconButton } from "@mui/material";
import { isMobile } from "../../platform/platform";
import { DamlLogoDark } from "../DamlLogoDark/DamlLogoDark";
import { PartyIdChip } from "../PartyIdChip/PartyIdChip";
import { SideMenuMobile } from "../SideMenuMobile.tsx/SideMenuMobile";
import { SideMenu } from "../SideMenu/SideMenu";
import { SideDrawerWrapper } from "../../SideDrawerWrapper/SideDrawerWrapper";
import { GettingStartedMessage } from "../GettingStartedMessage/GettingStarted";
import { Fab } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { WelcomeMessage } from "../WelcomeMessage/WelcomeMessage";
export const demoPartyId =
  "DEMO-ledger-party-03568cfb-dc57-4c54-90d6-7db79f0e3dc2";
interface TopAppBarProps {
  onLogout: () => void;
  party?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ party, onLogout }) => {
  const [isOpen, setOpen] = React.useState(false);
  const [isRightOpen, setRightOpen] = React.useState<boolean>(false);

  const toggleDrawer = () => {
    setOpen(!isOpen);
  };

  const toggleRightDrawer = () => {
    setRightOpen(!isRightOpen);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {!isMobile() && <DamlLogoDark />}
          {party && isMobile() && (
            <IconButton onClick={toggleDrawer}>
              {isOpen ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
          )}
          {isMobile() && <DamlLogoDark />}
          {!isMobile() && (
            <Typography variant="h6" noWrap component="div" sx={{ mt: 0.5 }}>
              Wallet Sample App
            </Typography>
          )}
          {party && <PartyIdChip party={party} onLogout={onLogout} />}
        </Toolbar>
      </AppBar>
      {party &&
        (isMobile() ? (
          <SideMenuMobile
            isOpen={isOpen}
            handleDrawerClose={toggleDrawer}
            handleDrawerOpen={toggleDrawer}
          />
        ) : (
          <SideMenu isRightOpen={true} toggleRightOpen={() => {}} />
        ))}
      {isMobile() && (
        <SideDrawerWrapper
          isOpen={!!party && isRightOpen}
          anchor="right"
          handleDrawerClose={toggleRightDrawer}
        >
          {party && (
            <div>
              <WelcomeMessage />
              <GettingStartedMessage />
            </div>
          )}
        </SideDrawerWrapper>
      )}
      {isMobile() && party && (
        <Fab
          onClick={toggleRightDrawer}
          sx={{ zIndex: 999, position: "fixed", bottom: 20, right: 30 }}
        >
          <QuestionMarkIcon color="info" />
        </Fab>
      )}
    </>
  );
};

import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import { Link, useLocation } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

import ListItemText from "@mui/material/ListItemText";
import {
  Divider,
  ListItemButton,
  Typography,
  Link as LinkBtn,
  
} from "@mui/material";
import { menuItems } from "../../configs/sideMenu.config";
import { openInNewTab } from "../../pages/LoginPage";

const drawerWidth: number = 200;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: theme.palette.text.secondary,
  },
}));

interface SideMenuProps {
  isRightOpen: boolean;
  toggleRightOpen: () => void;
}
export const SideMenu: React.FC<SideMenuProps> = (props) => {
  const location = useLocation();
  const [selected, setSelected] = React.useState<string | undefined>(
    location.pathname
  );

  React.useEffect(() => {
    if (localStorage.getItem("lastPath") !== selected) {
      setSelected(location.pathname);
    }
  }, [location.pathname, selected]);

  const setLastPath = (path: string) => {
    localStorage.setItem("lastPath", path);
  };

  const onClick = (path: string) => {
    setLastPath(path);
    setSelected(path);
  };

  const classes = useStyles();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", display: "flex", flexDirection: "column" }}>
        <List>
          {menuItems.map((item, index) => (
            <ListItemButton
              onClick={() => onClick(item.path)}
              selected={selected === item.path}
              key={index}
              component={Link}
              to={item.path}
            >
              <ListItemText className={classes.root}>{item.label}</ListItemText>
            </ListItemButton>
          ))}
          <ListItemButton onClick={() => openInNewTab('https://myinteractive.video/w/fgbRdGusDeoo')}>
            Walkthrough video
          </ListItemButton>
        </List>
      </Box>
      <Box marginTop={"auto"} marginBottom={3}>
        <Divider />
        <Box
          padding={2}
          flexDirection="column"
          display="flex"
          justifyContent="start"
        >
          <Typography variant="caption" color="text.secondary">
            <LinkBtn
              sx={{ textDecoration: "none" }}
              target="_blank"
              href="https://github.com/digital-asset/wallet-sample-app#welcome-to-the-wallet-daml-reference-app"
            >
              App ReadMe
            </LinkBtn>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <LinkBtn
              sx={{ textDecoration: "none" }}
              target="_blank"
              href="https://github.com/digital-asset/wallet-sample-app"
            >
              Github
            </LinkBtn>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <LinkBtn
              sx={{ textDecoration: "none" }}
              target="_blank"
              href="https://github.com/digital-asset/wallet-sample-app/issues"
            >
              Feature Requests
            </LinkBtn>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <LinkBtn
              sx={{ textDecoration: "none" }}
              href="https://docs.daml.com/getting-started/installation.html"
              target="_blank"
            >
              Download Daml
            </LinkBtn>
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

import React from "react";
import {
  Divider,
  ListItemButton,
  Typography,
  Link as LinkBtn,
  Box,
  List, 
  ListItemText
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";


import { menuItems } from "../../configs/sideMenu.config";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: theme.palette.text.secondary,
  },
}));
interface SideMenuContentProps {
  handleDrawerClose?: () => void;
}
export const SideMenuContent: React.FC<SideMenuContentProps> = (props) => {
  const {handleDrawerClose}= props;
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
    setSelected(path);
    setLastPath(path);
    handleDrawerClose && handleDrawerClose();
  };

  const classes = useStyles();
 
  return (
    <>
      <Box>
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
              href="https://github.com/digital-asset/wallet-sample-app#welcome-to-the-wallet-daml-sample-app"
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
    </>
  );
};

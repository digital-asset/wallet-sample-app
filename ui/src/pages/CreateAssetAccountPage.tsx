import { Box, Typography, IconButton } from "@mui/material";
import React from "react";
import { CreateAccountForm } from "../components/CreateAccountForm/CreateAccountForm";
import { usePageStyles } from "./AssetProfilePage";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../platform/platform";

export const CreateAssetAccountPage: React.FC = () => {
  const nav = useNavigate();

  const classes = usePageStyles();
  const onClick = () => {
    nav(-1);
  };

  return (
    <div className={classes.root}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box
          margin={1}
          width="100%"
          flexDirection="row"
          display="flex"
          alignItems="center"
          justifyContent="start"
        >
          {isMobile() && (
            <Box position="absolute">
              <IconButton color="primary" onClick={onClick}>
                <ArrowBackIosNewIcon />
              </IconButton>
            </Box>
          )}
          <Box flexGrow="1" textAlign="center">
            <Typography
              color="primary"
              variant="h5"
              sx={{ flexGrow: 1, marginLeft: "auto" }}
            >
              Create
            </Typography>
          </Box>
        </Box>
        <div className={classes.cardContent}>
          <CreateAccountForm />
        </div>
      </Box>
    </div>
  );
};

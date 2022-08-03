import React from "react";
import { usePageStyles } from "../../pages/AssetProfilePage";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

interface PageWrapperProps {
  title: string;
}
export const PageWrapper: React.FC<PageWrapperProps> = (
{children, title}
) => {
  const classes = usePageStyles();
  const nav = useNavigate();

  const onBack = () => {
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
          <Box position="absolute">
            <IconButton color="primary" onClick={onBack}>
              <ArrowBackIosNewIcon />
            </IconButton>
          </Box>
          <Box flexGrow="1" textAlign="center">
            <Typography
              color="primary"
              variant="h5"
              sx={{ flexGrow: 1, marginLeft: "auto" }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
       {children}
      </Box>
    </div>
  );
};

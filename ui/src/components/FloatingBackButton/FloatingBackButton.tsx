import { Fab } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export const FloatingBackButton: React.FC = () => {
  const nav = useNavigate();
  const onBack = () => {
    nav(-1);
  };
  return (
    <Fab onClick={onBack} sx={{ position: "fixed", bottom: 20, right: 30 }}>
      <ArrowBackIosNewIcon color="info" />
    </Fab>
  );
};

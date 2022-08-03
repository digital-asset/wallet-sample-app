import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import { isMobile } from "../platform/platform";
import { usePageStyles } from "./AssetProfilePage";
import { enableFabBack } from "./IssueAirdropPage";
import { FloatingBackButton } from "../components/FloatingBackButton/FloatingBackButton";
import { Account } from "@daml.js/account";
import { ContractId } from "@daml/types";
import {
  useGetUrlParams,
} from "../hooks/useGetAllUrlParams";
import { AirdropRequestForm } from "../components/AirdropRequestForm/AirdropRequestForm";

export const AirdropRequestPage: React.FC = () => {
  const nav = useNavigate();
  const classes = usePageStyles();
  const params = useGetUrlParams();
  const reference = params.reference as string | null; 
  const issuer = params.issuer as string;
  const symbol =  params.symbol as string;
  const owner = params.owner as string
  const isShareable = params.isShareable as boolean;
  const isAirdroppable = params.isAirdroppable as boolean;
  const isFungible = params.isFungible as boolean;
  const contractId = params.contractId as string;
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
              Airdrop Request
            </Typography>
          </Box>
        </Box>

        <Card variant="outlined">
          <CardContent className={classes.cardContent}>
            <Avatar className={classes.avatar}>
              {symbol?.[0] || "undefined"}
            </Avatar>
            <AirdropRequestForm
              assetAccountCid={contractId as ContractId<Account.AssetHoldingAccount>}
              issuer={issuer}
              isAirdroppable={isAirdroppable}
              isFungible={isFungible}
              isShareable={isShareable}
              owner={owner}
              reference={reference}
              symbol={symbol}
            />
          </CardContent>
        </Card>
      </Box>
      {enableFabBack && isMobile() && <FloatingBackButton />}
    </div>
  );
};

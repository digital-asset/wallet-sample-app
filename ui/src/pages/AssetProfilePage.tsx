import React from "react";
import { useLocation } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {
  Avatar,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import { AssetDetails } from "../components/AssetDetails/AssetDetails";
import SendIcon from "@mui/icons-material/Send";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import { isMobile } from "../platform/platform";
import { chipColors } from "../components/RowChip/RowChip";
import { numberWithCommas } from "../utils/numberWithCommas";
import { useGetMyOwnedAssetsByAssetType } from "../ledgerHooks/ledgerHooks";
import { getAssetSum } from "../utils/getAssetSum";
import ReportIcon from "@mui/icons-material/Report";
import { userContext } from "../App";
import { useCustomAdminParty } from "../hooks/useCustomAdminParty";
import { useGetUrlParams } from "../hooks/useGetAllUrlParams";
import { PageWrapper } from "../components/PageWrapper/PageWrapper";

export const usePageStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: isMobile() ? undefined : "center",
    width: "100%",
    flexGrow: "1",
    flexDirection: isMobile() ? "column" : "column",
    margin: theme.spacing(1),
  },
  cardContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: isMobile() ? "100%" : "500px",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    justifySelf: "center",
  },
  card: {
    margin: theme.spacing(1),
    width: "100%",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
  },
  actionContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    margin: theme.spacing(1),
  },
  tickerAmount: {
    display: "flex",
    flexDirection: "row",
  },
  buttonContainer: {
    marginBottom: theme.spacing(0.5),
    display: "flex",
    alignItems: "center",
  },
  issueButton: {
    color: chipColors.issuer,
  },
  issuerWarning: {
    backgroundColor: theme.palette.info.dark,
  },
  fromContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  from: {
    marginRight: theme.spacing(1),
  },
}));
export const AssetProfilePage: React.FC = () => {
  const params = useGetUrlParams();
  const { search } = useLocation();
  const party = userContext.useParty();
  const reference = params.reference as string | null;
  const issuer = params.issuer as string;
  const symbol = params.symbol as string;
  const owner = params.owner as string;
  const isShareable = params.isShareable as boolean;
  const isAirdroppable = params.isAirdroppable as boolean;
  const isFungible = params.isFungible as boolean;
  const { loading, contracts } = useGetMyOwnedAssetsByAssetType({
    reference,
    issuer,
    symbol,
    isFungible,
    owner,
  });
  const amount = getAssetSum(contracts);
  const formattedSum = numberWithCommas(amount);
  const classes = usePageStyles();
  const sendPath = `/send${search}`;
  const swapPath = `/swap${search}`;
  const assetInvitePath = `/invite${search}`;
  const issueAirdropPath = `/issue${search}`;
  const airdropRequestPath = `/airdrop-request${search}`;
  const admin = useCustomAdminParty();

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <PageWrapper title={symbol}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Avatar className={classes.avatar}>
            {(symbol as string)?.[0] || "undefined"}
          </Avatar>
          <div className={classes.tickerAmount}>
            <Typography sx={{ marginRight: 1 }} variant="h6">
              {formattedSum || 0}
            </Typography>
            <Typography variant="h6">{symbol || "undefined"}</Typography>
          </div>
          <div className={classes.actions}>
            {issuer === admin && symbol === "ET" && issuer !== party && (
              <div className={classes.actionContainer}>
                <IconButton
                  className={classes.issueButton}
                  component={Link}
                  to={airdropRequestPath}
                >
                  <AddBoxIcon />
                </IconButton>
                <Typography variant="caption">Request Airdrop</Typography>
              </div>
            )}
            {issuer === party && (
              <div className={classes.actionContainer}>
                <IconButton
                  className={classes.issueButton}
                  component={Link}
                  to={issueAirdropPath}
                >
                  <AddBoxIcon />
                </IconButton>
                <Typography variant="caption">Issue / airdrop</Typography>
              </div>
            )}
            <div className={classes.actionContainer}>
              <IconButton
                color="primary"
                disabled={amount === 0}
                component={Link}
                to={sendPath}
              >
                <SendIcon />
              </IconButton>
              <Typography variant="caption">Send</Typography>
            </div>
            <div className={classes.actionContainer}>
              <IconButton
                color="primary"
                disabled={amount === 0}
                component={Link}
                to={swapPath}
              >
                <SwapHorizontalCircleIcon />
              </IconButton>
              <Typography variant="caption">Swap</Typography>
            </div>
            <div className={classes.actionContainer}>
              <IconButton color="primary" component={Link} to={assetInvitePath}>
                <AccountBalanceWalletIcon />
              </IconButton>
              <Typography variant="caption">Invite</Typography>
            </div>
          </div>
          {amount === 0 && issuer === party && (
            <Card
              variant="outlined"
              sx={{
                width: "100%",
                margin: 1,
                alignItems: "center",
                padding: 1,
                display: "flex",
              }}
            >
              <ReportIcon sx={{ marginRight: 1 }} />
              <Typography variant="body2">
                You have {amount} amount. Click <b>issue / airdrop</b> to issue
                assets.
              </Typography>
            </Card>
          )}
          <AssetDetails
            isShareable={isShareable as boolean}
            isAirdroppable={isAirdroppable as boolean}
            owner={party}
            issuer={(issuer as string) || "issuer"}
            reference={reference as string | null}
            isFungible={isFungible as boolean}
            quantity={formattedSum}
            symbol={(symbol as string) || "Ticker"}
          />
        </CardContent>
      </Card>
    </PageWrapper>
  );
};

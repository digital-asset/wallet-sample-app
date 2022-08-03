import { Avatar, Card, CardContent, Divider, Typography } from "@mui/material";
import React from "react";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { AssetDetails } from "../AssetDetails/AssetDetails";
import { PendingSwapRowContents } from "../PendingSwapRowContents/PendingSwapRowContents";
import clx from "clsx";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  detailsContainer: {
    display: "flex",
  },
  direction: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    // alignItems: 'center',
    justifyContent: "space-between",
  },
  tickerAmount: {
    display: "flex",
    flexDirection: "row",
  },
  avatar: {
    margin: theme.spacing(1),
  },
  directionLabel: {
    padding: theme.spacing(1),
    margin: theme.spacing(0.5),
    borderRadius: 2,
  },
  swappingOut: {
    backgroundColor: theme.palette.error.dark,
  },
  swappingIn: {
    backgroundColor: theme.palette.success.dark,
  },
}));

interface SwapDetailsProps {
  receiver: string;
  isInbound: boolean;
  proposer: string;
  receiverAssetSymbol: string;
  receiverAssetAmount: string;
  proposerAssetSymbol: string;
  proposerAssetAmount: string;
  proposerAssetIsFungible: boolean;
  receiverAssetIsFungible: boolean;
  receiverAssetIssuer: string;
  proposerAssetIssuer: string;
  receiverAssetReference: string | null;
  proposerAssetReference: string | null;
  proposerAssetOwner: string;
  receiverAssetOwner: string;
}

export const SwapDetails: React.FC<SwapDetailsProps> = ({
  receiver,
  isInbound,
  proposer,
  receiverAssetSymbol,
  receiverAssetIsFungible,
  receiverAssetIssuer,
  receiverAssetReference,
  receiverAssetAmount,
  receiverAssetOwner,
  proposerAssetSymbol,
  proposerAssetIsFungible,
  proposerAssetReference,
  proposerAssetIssuer,
  proposerAssetOwner,
  proposerAssetAmount,
}) => {
  const classes = useStyles();

  const proposerGroup = {
    label: isInbound ? "Swapping In" : "Swapping Out",
    amount: proposerAssetAmount,
    symbol: proposerAssetSymbol,
    issuer: proposerAssetIssuer,
    isFungible: proposerAssetIsFungible,
    reference: proposerAssetReference,
    owner: proposerAssetOwner,
  };

  const receiverGroup = {
    label: !isInbound ? "Swapping In" : "Swapping Out",
    symbol: receiverAssetSymbol,
    amount: receiverAssetAmount,
    issuer: receiverAssetIssuer,
    isFungible: receiverAssetIsFungible,
    reference: receiverAssetReference,
    owner: receiverAssetOwner,
  };
  // User receiving a swap request
  // display what user is swapping in (recieving)
  const swaps = [proposerGroup, receiverGroup];

  return (
    <div className={classes.root}>
      <PendingSwapRowContents
        isSwapDetailsPage={true}
        proposer={proposer}
        receiver={receiver}
        isInbound={isInbound}
        proposerAssetAmount={proposerAssetAmount}
        proposerAssetSymbol={proposerAssetSymbol}
        receiverAssetAmount={receiverAssetAmount}
        receiverAssetSymbol={receiverAssetSymbol}
      />
      <Divider sx={{ marginBottom: 2 }} />
      {swaps.map((swap, i) => {
        return (
          <div className={classes.direction}>
            <div>
              <Typography
                className={clx(
                  classes.directionLabel,
                  swap.label === "Swapping In"
                    ? classes.swappingIn
                    : classes.swappingOut
                )}
                sx={{ marginLeft: 1 }}
                variant="h6"
              >
                {swap.label}
              </Typography>
            </div>
            <Card variant="outlined" sx={{ margin: 0.5, marginBottom: 1 }}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar className={classes.avatar}></Avatar>
                <div className={classes.tickerAmount}>
                  <Typography sx={{ marginRight: 1 }}>{swap.amount}</Typography>
                  <Typography>{swap.symbol || "[symbolName]"}</Typography>
                </div>
                <AssetDetails
                  owner={swap.owner}
                  symbol={swap.symbol}
                  issuer={swap.issuer}
                  isFungible={!!swap.isFungible}
                  quantity={swap.amount || "quantity"}
                />
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

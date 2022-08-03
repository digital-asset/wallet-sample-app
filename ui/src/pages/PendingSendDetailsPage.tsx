import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Card, CardContent, Typography } from "@mui/material";
import {
  useGetMyAssetAccountByKey,
  useGetAssetTransferByContractId,
  useLedgerHooks,
} from "../ledgerHooks/ledgerHooks";
import { AssetDetails } from "../components/AssetDetails/AssetDetails";
import { AssetTransfer } from "@daml.js/wallet-refapp/lib/Asset";
import { ContractId } from "@daml/types";

import { useGetUrlParams } from "../hooks/useGetAllUrlParams";
import { usePageStyles } from "./AssetProfilePage";
import { PageWrapper } from "../components/PageWrapper/PageWrapper";
import { AcceptRejectCancel } from "../components/AcceptRejectCancel/AcceptRejectCancel";

export const PendingSendDetailsPage: React.FC = () => {
  const params = useGetUrlParams();
  const contractId = params.contractId as string;
  const recipient = params.receiver as string;
  const symbol = params.symbol as string;
  const amount = params.amount as string;
  const issuer = params.issuer as string;
  const sender = params.sender as string;
  const isFungible = params.isFungible as boolean;
  const reference = params.reference as string | null;
  const owner = params.owner as string;
  const isInbound = params.isInbound as boolean;
  const nav = useNavigate();

  //TODO: can we use something else besdies contract
  const assetTransferResponse = useGetAssetTransferByContractId({
    contractId: contractId as ContractId<AssetTransfer>,
  });
  const assetTransferCid = assetTransferResponse.contract?.contractId;
  const assetAccountResponse = useGetMyAssetAccountByKey({
    issuer,
    symbol,
    fungible: isFungible,
    reference,
  });
  const assetAccountCid = assetAccountResponse.contract?.contractId;
  const classes = usePageStyles();
  const ledgerHooks = useLedgerHooks();
  const onBack = () => {
    nav(-1);
  };
console.log(assetAccountCid)
  if (!assetTransferCid) {
    return (
      <Card sx={{ width: "100%", margin: 1 }}>
        <CardContent>
          Contract doesn't exist anymore
          <Button
            onClick={onBack}
            size={"small"}
            sx={{ marginLeft: 1 }}
            variant="outlined"
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  const cancelChoice = () =>
    ledgerHooks.exerciseAssetTransferChoice(assetTransferCid, "cancel");
  const rejectChoice = () =>
    ledgerHooks.exerciseAssetTransferChoice(assetTransferCid, "reject");
  const acceptChoice = assetAccountCid ? () => 
    ledgerHooks.acceptAssetTransfer(assetAccountCid, assetTransferCid) : undefined

  return (
    <PageWrapper
      title={isInbound ? "Inbound Send Request" : "Outbound Send Request"}
    >
      <Card variant="outlined" className={classes.card}>
        <CardContent className={classes.cardContent}>
          <div className={classes.fromContainer}>
            <Typography className={classes.from} variant="caption">
              {isInbound ? "From:" : "To:"}
            </Typography>
            <Typography
              variant="caption"
              color="primary"
              sx={{ wordBreak: "break-all" }}
            >
              {isInbound ? sender : recipient}
            </Typography>
          </div>
          <Avatar className={classes.avatar}>{symbol?.[0] || "U"}</Avatar>
          <div className={classes.tickerAmount}>
            <Typography sx={{ marginRight: 1 }}>{amount || 0}</Typography>
            <Typography>{symbol || "[TickerName]"}</Typography>
          </div>
          <AssetDetails
            reference={reference}
            issuer={issuer}
            owner={owner}
            isFungible={isFungible}
            quantity={amount}
            symbol={symbol || "[Ticker]"}
          />
        </CardContent>

        {!assetAccountCid && (
          <Card sx={{ margin: 1, maxWidth: "500px" }}>
            <CardContent>
              You do not have an Asset Holding Account for this asset. Please
              ask the sender of this asset to invite you as an asset holder.
            </CardContent>
          </Card>
        )}
        {assetAccountCid && <AcceptRejectCancel
          rejectChoice={rejectChoice}
          acceptChoice={acceptChoice}
          cancelChoice={cancelChoice}
        />}
      </Card>
    </PageWrapper>
  );
};

import { Card, CardContent, Typography } from "@mui/material";
import React from "react";
import {
  useGetMyOwnedAssetsByAssetType,
  useLedgerHooks,
} from "../../ledgerHooks/ledgerHooks";

import { SwapDetails } from "../SwapDetails/SwapDetails";
import { Asset } from "@daml.js/asset";
import { ContractId } from "@daml/types";
import { Account } from "@daml.js/account";
import { userContext } from "../../App";
import { usePageStyles } from "../../pages/AssetProfilePage";
import { PageWrapper } from "../PageWrapper/PageWrapper";
import { AcceptRejectCancel } from "../AcceptRejectCancel/AcceptRejectCancel";
interface SwapProps {
  proposerAssetCid: ContractId<Asset.Asset>;
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
  requestedAssetTxPreApprovalCid: string;
  proposer: string;
  tradeCid: ContractId<Account.Trade>;
  receiver: string;
  isInbound: string;
}

export const Swap: React.FC<SwapProps> = (props) => {
  const {
    tradeCid,
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
    receiver,
    isInbound,
  } = props;
  const myPartyId = userContext.useParty();

  const outboundAssetContracts = useGetMyOwnedAssetsByAssetType({
    issuer: receiverAssetIssuer,
    symbol: receiverAssetSymbol,
    isFungible: receiverAssetIsFungible,
    owner: myPartyId,
    reference: receiverAssetReference,
  }).contracts;

  const outboundAssetCids = outboundAssetContracts.map(
    (contract) => contract.contractId
  );

  const classes = usePageStyles();
  const ledgerHooks = useLedgerHooks();

  const swapProps = {
    isInbound: isInbound,
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
    proposer,
    receiver,
  };

  const rejectChoice = () => ledgerHooks.exerciseTradeReject(tradeCid);
  const cancelChoice = () => ledgerHooks.exerciseTradeCancel(tradeCid);

  // For ACCEPTING a swap
  // we need the assetAccount of the asset that is going out
  // if outboundAssetCids is length 0, accept will fail.
  const acceptChoice = () =>
    ledgerHooks.exerciseTradeSettle(tradeCid, outboundAssetCids);

  return (
    <PageWrapper
      title={isInbound ? "Inbound Swap Request" : "Outbound Swap Request"}
    >
      <Card variant="outlined" className={classes.card}>
        <CardContent className={classes.cardContent}>
          <div className={classes.fromContainer}>
            <Typography className={classes.from} variant="caption">
              {isInbound ? "From" : "To:"}
            </Typography>
            <Typography
              variant="caption"
              color="primary"
              sx={{ wordBreak: "break-all" }}
            >
              {isInbound ? proposer : receiver}
            </Typography>
          </div>

          <SwapDetails {...swapProps} />
        </CardContent>
       
        <AcceptRejectCancel
          rejectChoice={rejectChoice}
          acceptChoice={acceptChoice}
          cancelChoice={cancelChoice}
        />
      </Card>
    </PageWrapper>
  );
};

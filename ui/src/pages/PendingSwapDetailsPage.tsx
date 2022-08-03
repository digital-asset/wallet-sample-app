import React from "react";

import { ContractId } from "@daml/types";
import { Asset } from "@daml.js/asset";
import { Swap } from "../components/Swap/Swap";
import {
  useGetTransferPreapprovalContractByContractId,
} from "../ledgerHooks/ledgerHooks";
import { LinearProgress } from "@mui/material";
import { Trade, TransferPreApproval } from "@daml.js/wallet-refapp/lib/Account";
import { useGetUrlParams } from "../hooks/useGetAllUrlParams";

export const PendingSwapDetailsPage: React.FC = (
  
) => {

  const params = useGetUrlParams();
  const proposer  = params.proposer as string
  const tradeCid = params.tradeCid as ContractId<Trade>
  const receiver = params.receiver as string
  const requestedAssetTxPreApprovalCid = params.requestedAssetTxPreApprovalCid as ContractId<TransferPreApproval>
  const proposerAssetCid = params.proposerAssetCid as ContractId<Asset.Asset>
  const isInbound = params.isInbound as boolean;
  const proposerAssetSymbol = params.proposerAssetSymbol as string;
  const proposerAssetReference = params.proposerAssetReference as string | null ;
  const proposerAssetIssuer = params.proposerAssetIssuer as string;
  const proposerAssetAmount = params.proposerAssetAmount as string; 
  const proposerAssetOwner = params.proposerAssetOwner as string;
  const proposerAssetIsFungible = params.proposerAssetIsFungible as boolean;
  const receiverAssetOwner = params.receiverAssetOwner as string;
  const receiverAssetSymbol = params.receiverAssetSymbol as string;
  const receiverAssetReference = params.receiverAssetReference as string | null;
  const receiverAssetIsFungible = params.receiverAssetIsFungible as boolean;
  const receiverAssetAmount = params.receiverAssetAmount as string;
  const receiverAssetIssuer = params.receiverAssetIssuer as string;

  // TODO not sure if that's the right way

  const transferPreapprovalLoading =
    useGetTransferPreapprovalContractByContractId(
      requestedAssetTxPreApprovalCid
    ).loading;

  // This is the receiver assets
  // since it is the proposer that iniates the swap,

  if (transferPreapprovalLoading) {
    return <LinearProgress />;
  }
  const swapProps = {
    tradeCid,
    requestedAssetTxPreApprovalCid,
    proposer,
    proposerAssetCid,
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
  };
  return <Swap {...swapProps} />;
};

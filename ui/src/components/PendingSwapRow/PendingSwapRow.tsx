import React from "react";
import Card from "@mui/material/Card";
import {  CardContent } from "@mui/material";
import {
  useGetAssetInSwapContractByContractId,
  useGetTransferPreapprovalContractByContractId,
} from "../../ledgerHooks/ledgerHooks";
import { ContractId } from "@daml/types";
import {
  AssetInSwap,
  TransferPreApproval,
} from "@daml.js/wallet-refapp/lib/Trade/module";
import { createQueriesString } from "../../utils/createQueriesString";
import { PendingTxPreview, TransactionTypesTitles } from "../PendingTxPreview/PendingTxPreview";
import { PendingRowWrapper } from "../PendingRowWrapper/PendingRowWrapper";

interface PendingSwapRowProps {
  proposer: string;
  receiver: string;
  requestedAssetTxPreApprovalCid: ContractId<TransferPreApproval>;
  proposerAssetCid: ContractId<AssetInSwap>;
  isInbound: boolean;
  isSwapDetailsPage?: boolean;
  tradeCid: string;
  transactionType: keyof TransactionTypesTitles;
}

export const PendingSwapRow: React.FC<PendingSwapRowProps> = (props) => {
  const {
    proposerAssetCid,
    requestedAssetTxPreApprovalCid,
    proposer,
    receiver,
    isInbound,
    tradeCid,
    transactionType
  } = props;
  const transferPreapproval = useGetTransferPreapprovalContractByContractId(
    requestedAssetTxPreApprovalCid
  ).contract;
  const proposerAsset =
    useGetAssetInSwapContractByContractId(proposerAssetCid).contract;
  const proposerAssetSymbol =
    proposerAsset?.payload.asset.assetType?.symbol || "";
  const proposerAssetAmount = proposerAsset?.payload.asset.amount || "";
  const proposerAssetIsFungible =
    proposerAsset?.payload.asset.assetType.fungible || false;
  const proposerAssetIssuer =
    proposerAsset?.payload.asset.assetType.issuer || "";
  const proposerAssetOwner = proposerAsset?.payload.asset.owner || "";

  const proposerAssetReference = proposerAsset?.payload.asset.assetType
    .reference as string;

  const receiverAssetSymbol =
    transferPreapproval?.payload.asset.assetType.symbol || "";
  const receiverAssetAmount = transferPreapproval?.payload.asset.amount || "";
  const receiverAssetIssuer =
    transferPreapproval?.payload.asset.assetType.issuer || "";
  const receiverAssetIsFungible =
    transferPreapproval?.payload.asset.assetType.fungible || "";
  const receiverAssetReference = transferPreapproval?.payload.asset.assetType
    .reference as string;

  const receiverAssetOwner = transferPreapproval?.payload.asset.owner || "";

  if (!proposerAsset || !transferPreapproval) {
    return null;
  }

  const queriesInput: string[][] = [
    ["proposer", proposer],
    ["receiver", receiver],
    ["requestedAssetTxPreApprovalCid", requestedAssetTxPreApprovalCid],
    ["tradeCid", tradeCid],
    ["isInbound", `${isInbound}`],
    ["templateName", "swap"],
    ["proposerAssetCid", proposerAssetCid],
    ["receiverAssetIssuer", receiverAssetIssuer],
    ["receiverAssetSymbol", receiverAssetSymbol],
    ["proposerAssetSymbol", proposerAssetSymbol],
    ["receiverAssetIsFungible", `${receiverAssetIsFungible}`],
    ["receiverAssetOwner", receiverAssetOwner],
    ["receiverAssetAmount", receiverAssetAmount],
    ["receiverAssetReference", receiverAssetReference],
    ["proposerAssetIssuer", proposerAssetIssuer],
    ["proposerAssetAmount", proposerAssetAmount],
    ["proposerAssetOwner", proposerAssetOwner],
    ["proposerAssetReference", proposerAssetReference],
    ["proposerAssetIsFungible", `${proposerAssetIsFungible}`],
  ];
  const queries = createQueriesString(queriesInput);
  const path = `/pending-swap?` + queries;

  if (
    proposerAssetAmount === undefined ||
    proposerAssetSymbol === undefined ||
    receiverAssetAmount === undefined ||
    receiverAssetSymbol === undefined
  ) {
    return (
      <>
        <Card>
          <CardContent>Error in retriving data</CardContent>
        </Card>
      </>
    );
  }

  return (
     <PendingRowWrapper path={path} transactionType={transactionType}>
            <PendingTxPreview  sender={proposer}
              receiver={receiver}
              isInbound={isInbound}
              proposerAssetAmount={proposerAssetAmount}
              transactionType={transactionType}
              proposerAssetSymbol={proposerAssetSymbol}
              receiverAssetAmount={receiverAssetAmount}
              receiverAssetSymbol={receiverAssetSymbol}/>
          </PendingRowWrapper>
  );
};

import { LinearProgress } from "@mui/material";
import React from "react";
import { useGetAssetTransfers } from "../../ledgerHooks/ledgerHooks";
import { PendingTransferRow } from "../PendingTransferRow/PendingTransferRow";
import { TransactionTypesTitles } from "../PendingTxPreview/PendingTxPreview";

interface PendingTransfersProps {
  isInbound: boolean;
}

export const PendingTransfers: React.FC<PendingTransfersProps> = (props) => {
  const { isInbound } = props;
  const { loading, contracts } = useGetAssetTransfers(isInbound);

  if (loading) {
    return <LinearProgress sx={{ width: "100%" }} />;
  }
  const pendingTransferRows = contracts.map((contract) => {
    const amount = contract.payload.asset.amount;
    const sender = contract.payload.asset.owner;
    const { issuer, fungible, symbol, reference } =
      contract.payload.asset.assetType;
    const receiver = contract.payload.recipient;
    const transferCid = contract.contractId;
    const owner = contract.payload.asset.owner;
    const pendingTransferRowProps = {
      amount,
      symbol,
      sender,
      receiver,
      issuer,
      isInbound,
      isNarrow: true,
      transferCid,
      isFungible: fungible,
      reference: reference as string | null,
      owner,
      transactionType: 'transfer' as keyof TransactionTypesTitles
    };
    return <PendingTransferRow {...pendingTransferRowProps} />;
  });

  return <>{pendingTransferRows}</>;
};

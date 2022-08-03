import React from "react";
import { createQueriesString } from "../../utils/createQueriesString";
import {
  PendingTxPreview,
  TransactionTypesTitles,
} from "../PendingTxPreview/PendingTxPreview";
import { PendingRowWrapper } from "../PendingRowWrapper/PendingRowWrapper";

export interface PendingTransferRowProps {
  amount: string;
  sender: string;
  receiver: string;
  isNarrow: boolean;
  isInbound: boolean;
  transferCid: string;
  owner: string;
  // assetType
  symbol: string;
  issuer: string;
  isFungible: boolean;
  reference: string | null;
  transactionType: keyof TransactionTypesTitles;
}

export const PendingTransferRow: React.FC<PendingTransferRowProps> = (
  props
) => {
  const {
    owner,
    isFungible,
    reference,
    transferCid,
    issuer,
    amount,
    symbol,
    sender,
    receiver,
    isInbound,
    transactionType,
  } = props;

  const quriesInput = [
    ["sender", sender],
    ["receiver", receiver],
    ["amount", amount],
    ["symbol", symbol],
    ["issuer", issuer],
    ["contractId", transferCid],
    ["templateName", "send"],
    ["isFungible", isFungible ? "true" : "false"],
    ["reference", reference as string],
    ["owner", owner],
    ["isInbound", `${isInbound}`],
  ];
  const queries = createQueriesString(quriesInput);
  const path = `/pending-transfer?` + queries;
  return (
    <PendingRowWrapper path={path} transactionType={transactionType}>
      <PendingTxPreview
        sender={sender}
        receiver={receiver}
        symbol={symbol}
        amount={amount}
        isInbound={isInbound}
        transactionType={transactionType}
      />
    </PendingRowWrapper>
  );
};

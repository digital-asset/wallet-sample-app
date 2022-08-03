import React from "react";
import { createQueriesString } from "../../utils/createQueriesString";

import {
  PendingTxPreview,
  TransactionTypesTitles,
} from "../PendingTxPreview/PendingTxPreview";
import { PendingRowWrapper } from "../PendingRowWrapper/PendingRowWrapper";

export interface PendingAccountInviteRowProps {
  sender: string;
  receiver: string;
  isNarrow: boolean;
  isInbound: boolean;
  accountInviteCid: string;
  owner: string;
  // assetType
  symbol: string;
  issuer: string;
  isFungible: boolean;
  reference: string | null;
  isAirdroppable: boolean;
  isShareable: boolean;
  transactionType: keyof TransactionTypesTitles;
}

export const PendingAccountInviteRow: React.FC<PendingAccountInviteRowProps> = (
  props
) => {
  const {
    isAirdroppable,
    isShareable,
    owner,
    isFungible,
    reference,
    accountInviteCid,
    issuer,
    symbol,
    sender,
    receiver,
    isInbound,
    transactionType,
  } = props;

  const queriesInput = [
    ["sender", sender],
    ["receiver", receiver],
    ["symbol", symbol],
    ["issuer", issuer],
    ["contractId", accountInviteCid],
    ["templateName", "accountInvite"],
    ["isFungible", isFungible ? "true" : "false"],
    ["reference", reference as string],
    ["isAirdroppable", `${isAirdroppable}`],
    ["owner", owner],
    ["isInbound", `${isInbound}`],
    ["isShareable", `${isShareable}`],
  ];
  const queries = createQueriesString(queriesInput);
  const path = `/pending-account-invite?` + queries;
  return (
    <PendingRowWrapper path={path} transactionType={transactionType}>
      <PendingTxPreview
        transactionType={transactionType as keyof TransactionTypesTitles}
        sender={sender}
        receiver={receiver}
        symbol={symbol}
        isInbound={isInbound}
      />
    </PendingRowWrapper>
  );
};

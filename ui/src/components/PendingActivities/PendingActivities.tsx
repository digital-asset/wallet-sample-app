import React from "react";
import { PendingAccountInvites } from "../PendingAccountInvites/PendingAccountInvites";
import { PendingSwaps } from "../PendingSwaps/PendingSwaps";
import { PendingTransfers } from "../PendingTransfers/PendingTransfers";

export interface PendingActivitiesPageProps {
  isInbound: boolean;
}

export const PendingActivities: React.FC<PendingActivitiesPageProps> = (
  props
) => {
  const { isInbound } = props;
  return (
    <>
      <PendingTransfers isInbound={isInbound} />
      <PendingAccountInvites isInbound={isInbound} />
      <PendingSwaps isInbound={isInbound} />
    </>
  );
};

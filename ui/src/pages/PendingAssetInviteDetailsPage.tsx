import React from "react";
import {
  Avatar,
  Card,
  CardContent,
  LinearProgress,
  Typography,
} from "@mui/material";
import {
  useGetAssetHoldingInviteByContractId,
  useLedgerHooks,
} from "../ledgerHooks/ledgerHooks";
import { AssetDetails } from "../components/AssetDetails/AssetDetails";
import { ContractId } from "@daml/types";
import { Account } from "@daml.js/account";
import { useGetUrlParams } from "../hooks/useGetAllUrlParams";
import { usePageStyles } from "./AssetProfilePage";
import { PageWrapper } from "../components/PageWrapper/PageWrapper";
import { AcceptRejectCancel } from "../components/AcceptRejectCancel/AcceptRejectCancel";

export type ActionType = "accept" | "reject" | "cancel";

export const PendingAssetInviteDetailsPage: React.FC = () => {
  const params = useGetUrlParams();
  const sender = params.sender as string;
  const recipient = params.recipient as string;
  const symbol = params.symbol as string;
  const issuer = params.issuer as string;
  const contractId =
    params.contractId as ContractId<Account.AssetHoldingAccountProposal>;
    const isAirdroppable = params.isAirdroppable as boolean;
    const isShareable = params.isShareable as boolean;
    const owner = params.owner as string;
    const isInbound = params.isInbound as boolean;
    const isFungible = params.isFungible as boolean;
  //TODO: can we use something else besdies contract
  // TODO: This is merely used to check if the contract exists
  // If someone copy and pastes a URL with an invalid contractId,
  // we can error out here, but the below is not necessary
  const { loading, contract: accountInviteContract } =
    useGetAssetHoldingInviteByContractId(contractId);

  const classes = usePageStyles();
  const ledgerHooks = useLedgerHooks();

  if (loading) {
    <LinearProgress />;
  }

  if (!loading && !accountInviteContract) {
    return (
      <Card sx={{ width: "100%" }}>
        <CardContent>This account invite Contract doesn't exist</CardContent>
      </Card>
    );
  }

  const cancelChoice = () =>
    ledgerHooks.exerciseAssetHolderInvite(
      contractId as ContractId<Account.AssetHoldingAccountProposal>,
      "cancel"
    );
  const rejectChoice = () =>
    ledgerHooks.exerciseAssetHolderInvite(
      contractId as ContractId<Account.AssetHoldingAccountProposal>,
      "reject"
    );
  const acceptChoice = () =>
    ledgerHooks.exerciseAssetHolderInvite(
      contractId as ContractId<Account.AssetHoldingAccountProposal>,
      "accept"
    );

  return (
    <PageWrapper
      title={
        isInbound
          ? "Inbound Asset Holding Invite"
          : "Outbound Asset Holding Invite"
      }
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
              sx={{ wordBreak: "break-word" }}
            >
              {isInbound ? sender : recipient}
            </Typography>
          </div>
          <Avatar className={classes.avatar}>{symbol[0] || "U"}</Avatar>
          <Typography>{symbol}</Typography>
          <AssetDetails
            issuer={issuer}
            owner={owner}
            isAirdroppable={isAirdroppable}
            isShareable={isShareable}
            symbol={symbol}
            reference={null}
            isFungible={isFungible}
          />
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

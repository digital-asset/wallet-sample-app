import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicParty } from "../Credentials";
import { useTxNotifications } from "../hooks/useTxNotifications";
import { AccountInvitePage } from "./AccountInvitePage";
import { AirdropRequestPage } from "./AirdropRequestPage";
import { AssetProfilePage } from "./AssetProfilePage";
import { CreateAssetAccountPage } from "./CreateAssetAccountPage";
import { IssueAirdropPage } from "./IssueAirdropPage";
import { MyActiveAccountsPage } from "./MyActiveAccounts";
import { PendingActivitiesPage } from "./PendingActivitiesPage";
import { PendingAssetInviteDetailsPage } from "./PendingAssetInviteDetailsPage";
import { PendingSendDetailsPage } from "./PendingSendDetailsPage";
import { PendingSwapDetailsPage } from "./PendingSwapDetailsPage";
import { SendPage } from "./SendPage";
import { SwapPage } from "./SwapPage";
import {Transactions} from "./Transactions"
import { TransactionsSpecific } from "./TransactionsSpecific";

interface PagesProps {
  getPublicParty: () => PublicParty;
}

export const Pages: React.FC<PagesProps> = React.memo((props) => {
  // Todo: redux, or extract
  const { getPublicParty } = props;
  useTxNotifications();
  return (
    <Routes>
      <Route path="/asset" element={<AssetProfilePage />} />
      <Route path="/pending/" element={<PendingActivitiesPage />} />
      <Route path="/transactions/" element={<Transactions />} />
      <Route path="/transactionstoken/" element={<TransactionsSpecific />} />
      <Route path="/pending-transfer" element={<PendingSendDetailsPage />} />
      <Route path="/pending-swap" element={<PendingSwapDetailsPage />} />
      <Route
        path="/pending-account-invite"
        element={<PendingAssetInviteDetailsPage />}
      />
      <Route path="/send" element={<SendPage />} />
      <Route path="/airdrop-request" element={<AirdropRequestPage />} />
      <Route path="/swap" element={<SwapPage />} />
      <Route path="/issue" element={<IssueAirdropPage />} />
      <Route path="/invite" element={<AccountInvitePage />} />
      <Route path="/create" element={<CreateAssetAccountPage />} />
      <Route
        path="/"
        element={<MyActiveAccountsPage getPublicParty={getPublicParty} />}
      />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
});

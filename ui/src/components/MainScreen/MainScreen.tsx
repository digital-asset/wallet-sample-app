import React from "react";
import { PublicParty } from "../../Credentials";
import { Pages } from "../../pages/Pages";
import { User } from "@daml.js/user";
import { Account } from "@daml.js/account";
import { userContext } from "../../App";
import { useCustomAdminParty } from "../../hooks/useCustomAdminParty";
import { LinearProgress } from "@mui/material";
interface MainScreenProps {
  getPublicParty: () => PublicParty;
}

const toAlias = (userId: string): string =>
  userId.charAt(0).toUpperCase() + userId.slice(1);

export const MainScreen: React.FC<MainScreenProps> = (props) => {
  const { getPublicParty } = props;
  const user = userContext.useUser();
  const party = userContext.useParty();
  const { usePublicParty, setup } = getPublicParty();
  const setupMemo = React.useCallback(setup, [setup]);
  React.useEffect(setupMemo);
  const publicParty = usePublicParty();
  const admin = useCustomAdminParty();

  const ledger = userContext.useLedger();

  const [createdUser, setCreatedUser] = React.useState(false);
  const [createdAlias, setCreatedAlias] = React.useState(false);

  const createUserMemo = React.useCallback(async () => {
    try {
      let userContract = await ledger.fetchByKey(User.User, party);
      if (userContract === null) {
        const user = { username: party };
        userContract = await ledger.create(User.User, user);
      }
      setCreatedUser(true);
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
    }
  }, [ledger, party]);

  const createExampleAccount = React.useCallback(async () => {
    let exampleAccount =
      admin &&
      (await ledger.fetchByKey(Account.AssetHoldingAccount, {
        _1: { issuer: admin, fungible: true, symbol: "ET", reference: null },
        _2: party,
      }));
    // from admin
    let etAccountProposals =
      admin &&
      (await ledger.query(Account.AssetHoldingAccountProposal, {
        account: {
          assetType: {
            issuer: admin,
            fungible: true,
            symbol: "ET",
          },
          owner: admin,
          airdroppable: true,
          resharable: true,
        },
        recipient: party,
      }));

    if (exampleAccount === null && etAccountProposals.length === 0) {
      await ledger.create(Account.AssetHoldingAccountRequest, {
        recipient: party,
        owner: admin,
      });
    }
  }, [admin, ledger, party]);

  const createAliasMemo = React.useCallback(async () => {
    if (publicParty) {
      try {
        let userAlias = await ledger.fetchByKey(User.Alias, {
          _1: party,
          _2: publicParty,
        });
        if (userAlias === null) {
          await ledger.create(User.Alias, {
            username: party,
            alias: toAlias(user.userId),
            public: publicParty,
          });
        }
      } catch (error) {
        alert(`Unknown error:\n${JSON.stringify(error)}`);
      }
      setCreatedAlias(true);
    }
  }, [ledger, user, publicParty, party]);

  React.useEffect(() => {
    createUserMemo();
  }, [createUserMemo]);
  React.useEffect(() => {
    createAliasMemo();
  }, [createAliasMemo]);
  React.useEffect(() => {
    createExampleAccount();
  }, [createExampleAccount]);
  if (!createdAlias || !createdUser) {
    return <LinearProgress sx={{ width: "100%" }} />;
  }
  return (
      <Pages getPublicParty={getPublicParty} />
  );
};

import Box from "@mui/material/Box";
import React from "react";
import { isMobile } from "../platform/platform";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { AssetAccountRow } from "../components/AssetAccountRow/AssetAccountRow";
import { Prompt } from "../components/Prompts/Prompt";
import { LinearProgress, Typography } from "@mui/material";
import {
  useGetAllAssetHoldingAccounts,
} from "../ledgerHooks/ledgerHooks";
import { PublicParty } from "../Credentials";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: isMobile() ? theme.spacing(0) : theme.spacing(1),
    overflow: "hidden",
  },
  welcome: {
    fontWeight: "bold",
  },
}));



interface MyActiveAccountsPageProps {
  getPublicParty: () => PublicParty;
}

export const MyActiveAccountsPage: React.FC<MyActiveAccountsPageProps> = (
) => {
  const classes = useStyles();
  const { loading, contracts } = useGetAllAssetHoldingAccounts();

  const assetRows = contracts.map((contract) => (
    <AssetAccountRow
      key={contract.contractId}
      contractId={contract.contractId}
      isFungible={contract.payload.assetType.fungible}
      owner={contract.payload.owner}
      issuer={contract.payload.assetType.issuer}
      reference={contract.payload.assetType.reference}
      symbol={contract.payload.assetType.symbol}
      isAirdroppable={contract.payload.airdroppable}
      isShareable={contract.payload.resharable}
    />
  ));

  if (loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }
  return (
    <Box component="main" sx={{ flexGrow: 1 }} className={classes.root}>
      <Box sx={{ margin: isMobile() ? 1 : 0 }}>
        <Prompt>
          <Typography color="text.primary" variant="body2">
            Your Asset Holding Accounts are listed here along with the
            corresponding balance. If there is an asset that you wish to own,
            contact an existing Asset Holding Account owner and request an
            invite to the account.
          </Typography>
        </Prompt>
        {assetRows}
      </Box>
    </Box>
  );
};

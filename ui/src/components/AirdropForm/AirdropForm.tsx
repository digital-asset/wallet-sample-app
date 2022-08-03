import React from "react";
import TextField from "@mui/material/TextField";
import {
  Box,
  CardContent,
  Card,
  FormControl,
  Typography,
  Alert,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { AirdropInvites } from "../AirdropInvites/AirdropInvites";
import {
  useGetAssetHoldingAccountProposals,
  useGetMyAssetAccountByKey,
  useLedgerHooks,
} from "../../ledgerHooks/ledgerHooks";
import { SharedSnackbarContext } from "../../context/SharedSnackbarContext";

interface AirdropFormProps {
  symbol: string;
  isFungible: boolean;
  reference: string | null;
  owner: string;
  issuer: string;
  isAirdroppable: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "start",
  },
}));

export const AirdropForm: React.FC<AirdropFormProps> = (props) => {
  const { issuer, owner, symbol, isFungible, reference, isAirdroppable } = props;
  const [hasError, setError] = React.useState(false);
  const [recipient, setRecipient] = React.useState("");
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [isSuccessful, setSuccessful] = React.useState<boolean>(false);
  const [hasAccount, setHasAccount] = React.useState(false);
  const ledgerHooks = useLedgerHooks();
  const [hasPending, setPending] = React.useState(false);
  const account = useGetMyAssetAccountByKey(
    {
      reference,
      issuer,
      symbol,
      fungible: isFungible,
    },
    recipient
  );
  const pendingInvites = useGetAssetHoldingAccountProposals({
    reference,
    symbol,
    fungible: isFungible,
  }).contracts;

  const { openSnackbar } = React.useContext(SharedSnackbarContext);

  const onReset = () => {
    setRecipient("");
    setLoading(false);
    setError(false);
    setSuccessful(false);
    setHasAccount(false);
    setPending(false);
  };

  const onSubmit = async () => {
    if (account.contract !== null) {
      setHasAccount(true);
      setPending(false);
      return;
    } else {
      setHasAccount(false);
    }

    if (
      pendingInvites.filter(
        (contract) => contract.payload.recipient === recipient
      ).length
    ) {
      setPending(true);
      setHasAccount(false);
      return;
    } else {
      setPending(false);
    }
    setLoading(true);

    const result = await ledgerHooks.inviteNewAssetHolder({
      recipient,
      owner,
      assetType: {
        issuer,
        reference: reference || null,
        fungible: isFungible,
        symbol,
      },
    });
    if (result.isOk) {
      setLoading(false);
      setSuccessful(true);
      setError(false);
      openSnackbar(`Invitiation sent to ${recipient}`, "success");
      onReset();
    } else {
      setLoading(false);
      setError(true);
      setSuccessful(false);
    }
  };

  const handleKeyboardEvent = (e: React.KeyboardEvent<HTMLImageElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  const classes = useStyles();
  return (
    <>
      <Card
        className={classes.root}
        elevation={0}
        variant="outlined"
        sx={{ marginBottom: 2, width: '100%' }}
      >
        {isAirdroppable ? <Typography color="text.primary" variant="body2" p={1}>
          To airdrop assets, recipients must be an account holder for the asset. The invitation form below allows you to send an Asset Holding Account invitation. Once the recipient accepts, then you can airdrop
          assets to the recipients by clicking <b>send</b>
        </Typography> : 
        <Typography color="text.primary" variant="body2" p={1}>
        This asset is not airdroppable
      </Typography>
        
        }
      </Card>
      <FormControl error={hasError} className={classes.root}>
        <Box mr={0.5}>
          <TextField
            margin="none"
            id="userId"
            label="Recipient's Party ID"
            type="text"
            fullWidth
            value={recipient}
            variant="outlined"
            onKeyDown={handleKeyboardEvent}
            size="small"
            disabled={isLoading || !isAirdroppable}
            autoComplete="off"
            sx={{ marginRight: 1 }}
            onChange={(e) => setRecipient(e.currentTarget.value)}
          />
          <Typography variant="caption" color="text.secondary">
            Input party ID of the user you want to invite to airdrop.
          </Typography>
        </Box>
        <LoadingButton
          disabled={recipient.length === 0}
          loading={isLoading}
          loadingPosition="end"
          variant="outlined"
          onClick={onSubmit}
        >
          {isSuccessful ? "Send" : "Send"}
        </LoadingButton>
      </FormControl>
      {hasAccount && (
        <Card sx={{ marginBottom: 1, width: "100%", mt: 1 }}>
          <Alert
            variant="filled"
            severity="warning"
            sx={{ alignItems: "center", width: "100%" }}
          >
            <Typography color="text.primary" variant="body2" p={1}>
              User already has this Asset Holding Account
            </Typography>
          </Alert>
        </Card>
      )}
      {hasPending && (
         <Card sx={{ marginBottom: 1, width: "100%", mt: 1 }}>
         <Alert
           variant="filled"
           severity="warning"
           sx={{ alignItems: "center", width: "100%" }}
         >
           <Typography color="text.primary" variant="body2" p={1}>
             User already has pending invitation.
           </Typography>
         </Alert>
       </Card>
      )}
      {hasError && (
        <Card sx={{ margin: 1, width: "100%" }}>
          <CardContent>
            <Typography>An error was encountered, please try again.</Typography>
          </CardContent>
        </Card>
      )}
      <AirdropInvites
        symbol={symbol}
        isFungible={isFungible}
        reference={reference}
      />
    </>
  );
};


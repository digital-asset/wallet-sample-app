import React from "react";
import TextField from "@mui/material/TextField";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  LinearProgress,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import {
  useGetMyOwnedAssetsByAssetType,
  useLedgerHooks,
} from "../../ledgerHooks/ledgerHooks";
import { ContractId } from "@daml/types";
import { AssetHoldingAccount } from "@daml.js/wallet-refapp/lib/Account";
import { SharedSnackbarContext } from "../../context/SharedSnackbarContext";
import { getAssetSum } from "../../utils/getAssetSum";
import { numberWithCommas } from "../../utils/numberWithCommas";
import InfoIcon from "@mui/icons-material/Info";
interface SendFormProps {
  symbol: string;
  isAirdroppable: boolean;
  isShareable: boolean;
  isFungible: boolean;
  owner: string;
  reference: string | null;
  issuer: string;
  assetAccountCid: ContractId<AssetHoldingAccount>;
}

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
  },
  helpMessage: {
    margin: theme.spacing(1, 0, 1, 0),
    wordBreak: 'break-word'
  },
  errorCard: {
    backgroundColor: theme.palette.error.dark,
  },
}));

export const SendForm: React.FC<SendFormProps> = (props) => {
  const { reference, assetAccountCid, issuer, isFungible, symbol, owner } =
    props;
  const classes = useStyles();
  const nav = useNavigate();
  const { openSnackbar } = React.useContext(SharedSnackbarContext);
  const { loading, contracts } = useGetMyOwnedAssetsByAssetType({
    issuer,
    symbol: symbol,
    isFungible: isFungible,
    owner,
    reference,
  });
  const ledgerHooks = useLedgerHooks();
  const assetCids = contracts.map((contract) => contract.contractId);
  const assetSum = getAssetSum(contracts);
  const formattedSum = numberWithCommas(assetSum);

  const onCancel = () => {
    nav(-1);
  };

  const [recipient, setRecipient] = React.useState("");
  const [amount, setAmount] = React.useState(isFungible ? "" : "1");
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [isSuccessful, setSuccessful] = React.useState<boolean>(false);
  const [hasError, setError] = React.useState<boolean>(false);

  if (loading) {
    return <LinearProgress sx={{ width: "100%" }} />;
  }
  const handleKeyboardEvent = (e: React.KeyboardEvent<HTMLImageElement>) => {
    if (e.key === "Enter") {
      isSuccessful ? onReset() : onSubmit();
    }
  };
  const onSubmit = async () => {
    setLoading(true);
    const result = await ledgerHooks.sendAsset({
      assetAccountCid,
      amount,
      recipient,
      assetCids: isFungible ? assetCids : [assetCids[0]],
    });
    if (result.isOk) {
      setLoading(false);
      setSuccessful(true);
      setError(false);
      openSnackbar("Transfer Request Sent", "success");
    } else {
      setSuccessful(false);
      setLoading(false);
      setError(true);
    }
  };

  const onReset = () => {
    setAmount(isFungible ? "" : "1");
    setRecipient("");
    setSuccessful(false);
    setError(false);
  };

  return (
    <>
      <FormControl className={classes.root}>
        <Box display="flex" justifyContent="center">
          <Typography variant="h6">{formattedSum || "undefined"}</Typography>
          <Typography marginLeft={1} variant="h6">
            {symbol || "No symbol defined"}
          </Typography>
        </Box>
        <TextField
          disabled={isLoading || isSuccessful}
          margin="normal"
          onKeyDown={handleKeyboardEvent}
          id="recipient"
          label="Recipient's Party ID"
          type="text"
          value={recipient}
          autoComplete={"off"}
          fullWidth
          variant="outlined"
          size="small"
          onChange={(e) => setRecipient(e.currentTarget.value)}
        />
        <TextField
          disabled={isLoading || isSuccessful || !isFungible}
          margin="none"
          onKeyDown={handleKeyboardEvent}
          id="amount"
          value={amount}
          error={parseFloat(amount) < 0}
          label="Amount"
          type="number"
          fullWidth
          variant="outlined"
          size="small"
          onChange={(e) => setAmount(e.currentTarget.value)}
          inputProps={{
            inputMode: "decimal",
            type: "number",
            pattern: "[0-9]*",
          }}
        />
        {!isFungible && (
          <Card
            elevation={0}
            variant="outlined"
            className={classes.helpMessage}
          >
            <Box display="flex" alignItems="center" margin={1}>
              <InfoIcon color="primary" sx={{ marginRight: 1 }} />{" "}
              <Typography variant="body2">
                <i>Please note</i>
              </Typography>
            </Box>
            <Typography color="text.primary" variant="body2" p={1}>
              This asset is non-fungible, therefore you will need to transfer
              this asset 1 contract at a time.
            </Typography>
          </Card>
        )}
        <Card elevation={0} variant="outlined" className={classes.helpMessage}>
          <Box display="flex" alignItems="center" margin={1}>
            <InfoIcon color="primary" sx={{ marginRight: 1 }} />{" "}
            <Typography variant="body2">
              <i>Please note</i>
            </Typography>
          </Box>
          <Typography color="text.primary" variant="body2" p={1}>
            Check with the recipient and ensure they have the Asset Holding
            Account for <b>{symbol}</b>, and that the issuer is <b>{issuer}</b>.
            If the user does not have this Asset Holding Account, you can invite
            them as an Asset Holder by going <b>back</b> and click <b>Invite</b>
            . Otherwise the recipient will not be able to accept this asset.
          </Typography>
          <Typography color="text.primary" variant="body2" p={1}>
            An assetTransferProposal contract is created upon clicking send. The
            recipient will need to accept this request first before the
            ownership of the asset is transferred.
          </Typography>
        </Card>
        <LoadingButton
          endIcon={isSuccessful ? <CheckCircleIcon /> : <SendIcon />}
          loading={isLoading}
          fullWidth
          loadingPosition="end"
          variant="outlined"
          disabled={recipient.length <= 0}
          color={isSuccessful ? "success" : undefined}
          onClick={isSuccessful ? onReset : onSubmit}
          sx={{
            marginBottom: 0.5,
          }}
        >
          {isSuccessful ? "Make another transaction" : "Send"}
        </LoadingButton>
        <Button variant="outlined" onClick={onCancel}>
          {isSuccessful ? "Back" : "Back"}
        </Button>
      </FormControl>
      {hasError && (
        <Card className={classes.errorCard} sx={{ margin: 1, width: "100%" }}>
          <CardContent>
            <Typography>An error was encountered, please try again.</Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
};

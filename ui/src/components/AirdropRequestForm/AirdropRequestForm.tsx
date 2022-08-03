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
  },
  errorCard: {
    backgroundColor: theme.palette.error.dark,
  },
}));

export const AirdropRequestForm: React.FC<SendFormProps> = (props) => {
  const { reference, assetAccountCid, issuer, isFungible, symbol, owner } =
    props;
  const classes = useStyles();
  const nav = useNavigate();
  const { loading, contracts } = useGetMyOwnedAssetsByAssetType({
    issuer,
    symbol: symbol,
    isFungible: isFungible,
    owner,
    reference,
  });
  const ledgerHooks = useLedgerHooks();
  const assetSum = getAssetSum(contracts);
  const formattedSum = numberWithCommas(assetSum);

  const onCancel = () => {
    nav(-1);
  };
  const [amount, setAmount] = React.useState("");
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [isSuccessful, setSuccessful] = React.useState<boolean>(false);
  const [hasError, setError] = React.useState<boolean>(false);

  if (loading) {
    return <LinearProgress sx={{ width: "100%" }} />;
  }
  const onSubmit = async () => {
    setLoading(true);
    const result = await ledgerHooks.createAirdropRequest({
      assetHoldingAccountCid: assetAccountCid,
      amount,
      assetHoldingAccountIssuer: issuer,
      requester: "",
    });
    if (result.isOk) {
      setLoading(false);
      setSuccessful(true);
      setError(false);
    } else {
      setSuccessful(false);
      setLoading(false);
      setError(true);
    }
  };

  const onReset = () => {
    setAmount("");
    setSuccessful(false);
    setError(false);
  };

  return (
    <>
      <FormControl className={classes.root}>
        <Box display="flex" justifyContent="center">
          <Typography color="text.secondary" variant="body2" gutterBottom>
            Requesting
          </Typography>
          <Typography marginLeft={1} color="primary" variant="body2">
            {symbol || "No symbol defined"}
          </Typography>
          <Typography marginLeft={1} color="text.secondary" variant="body2">
            Balance:
          </Typography>
          <Typography marginLeft={1} color="primary" variant="body2">
            {formattedSum || "undefined"}
          </Typography>
        </Box>
        <TextField
          disabled={isLoading || isSuccessful}
          margin="none"
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
        <Card elevation={0} variant="outlined" className={classes.helpMessage}>
          <Box display="flex" alignItems="center" margin={1}>
            <InfoIcon color="primary" sx={{ marginRight: 1 }} />{" "}
            <Typography variant="body2">
              <i>Please note</i>
            </Typography>
          </Box>
          <Typography color="text.primary" variant="body2" p={1}>
            By requesting an airdrop, the issuer of this asset will be creating
            the asset directly in your wallet on behalf of you.
          </Typography>
          <Typography color="text.primary" variant="body2" p={1}>
            An AirdropRequest contract is created upon clicking <b>Request</b>,
            which the issuer will accept. Upon accepting, a new Asset contract
            is generated with your Party ID as the owner.
          </Typography>
        </Card>
        <LoadingButton
          endIcon={isSuccessful ? <CheckCircleIcon /> : <SendIcon />}
          loading={isLoading}
          fullWidth
          loadingPosition="end"
          variant="outlined"
          color={isSuccessful ? "success" : undefined}
          onClick={isSuccessful ? onReset : onSubmit}
          sx={{
            marginBottom: 0.5,
          }}
        >
          {isSuccessful ? "Complete, make another request" : "Request"}
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

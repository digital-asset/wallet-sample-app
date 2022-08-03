import TextField from "@mui/material/TextField";
import {
  Box,
  AlertColor,
  Button,
  Card,
  CardContent,
  FormControl,
  Typography,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import React, { useContext } from "react";
import { LoadingButton } from "@mui/lab";
import { useLedgerHooks } from "../../ledgerHooks/ledgerHooks";
import { useNavigate } from "react-router";
import { SharedSnackbarContext } from "../../context/SharedSnackbarContext";
import InfoIcon from "@mui/icons-material/Info";
import {Asset} from '@daml.js/asset';


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(0, 0, 0, 0),
  },
}));
interface IssueToSelfFormProps {
  symbol: string;
  handleClose: () => void;
  onNext?: () => void;
  onDoneClick?: () => void;
  issueLater?: () => void;
  cancelText?: string;
  reference: Asset.AssetType['reference']
  isFungible: Asset.AssetType['fungible']
}

export const IssueToSelfForm: React.FC<IssueToSelfFormProps> = (props) => {
  const { isFungible, reference, cancelText, issueLater, symbol, handleClose } =
    props;
  const classes = useStyles();
  const ledgerHooks = useLedgerHooks();
  const { openSnackbar } = useContext(SharedSnackbarContext);
  const nav = useNavigate();
  const onBack = () => {
    nav(-1);
  };
  const [hasError, setError] = React.useState<boolean>(false);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [amount, setAmount] = React.useState<string>(!isFungible ? "1" : "");
  const [isIssueToSelfSuccess, setIsIssueToSelfSuccess] = React.useState(false);

  const onIssue = async () => {
    setLoading(true);
    const result = await ledgerHooks.issueAsset({
      symbol,
      amount: amount,
      isFungible,
      reference,
    });

    if (result.isOk) {
      setLoading(false);
      handleClose();
      setIsIssueToSelfSuccess(true);
      setLoading(false);
      openSnackbar(`Issued ${amount} ${symbol}`, "success" as AlertColor);
    } else {
      openSnackbar("Encountered an error when issuing", "error");
      setLoading(false);
      setError(true);
    }
  };
  const onChange = (e: React.BaseSyntheticEvent) => {
    setAmount(e.target.value);
  };
  const onReset = React.useCallback(() => {
    setAmount( isFungible ? "" :"1");
    setIsIssueToSelfSuccess(false);
  }, [setAmount, setIsIssueToSelfSuccess, isFungible]);

  const handleKeyboardEvent = (e: React.KeyboardEvent<HTMLImageElement>) => {
    if (e.key === "Enter") {
      isIssueToSelfSuccess ? onReset() : onIssue();
    }
  };

  return (
    <>
      {
        <>
          <FormControl fullWidth>
            <Card className={classes.root} elevation={0} variant="outlined">
              <Typography color="text.primary" variant="body2" p={1}>
                The assets will be created directly in your wallet with the
                attributes you previously defined when creating the Asset
                Holding Account.
              </Typography>
            </Card>
            <TextField
              sx={{ mt: 1, mb: 1 }}
              margin="none"
              id="amount"
              label="Amount"
              type="number"
              value={isFungible ? amount : "1"}
              fullWidth
              onKeyDown={handleKeyboardEvent}
              variant="outlined"
              disabled={isIssueToSelfSuccess || !isFungible}
              size="small"
              onChange={(e) => {
                onChange(e);
              }}
              inputProps={{
                inputMode: "decimal",
                type: "number",
                pattern: "[0-9]*",
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
              Specify the quanity you would like to issue to wallet.
            </Typography>
            {!isFungible && (
              <Card className={classes.root} elevation={0} variant="outlined">
                <Box display="flex" alignItems="center" margin={1}>
                  <InfoIcon color="primary" sx={{ marginRight: 1 }} />{" "}
                  <Typography variant="body2">
                    <i>Please note</i>
                  </Typography>
                </Box>
                <Typography color="text.secondary" variant="body2" p={1}>
                  Since this is a non-fungible token, you are limited to issuing
                  the asset 1 contract at a time. <b>Each contract is unique and
                  cannot be split or merged.</b>
                </Typography>
              </Card>
            )}
          </FormControl>

          <LoadingButton
            loading={isLoading}
            fullWidth
            variant="outlined"
            onClick={isIssueToSelfSuccess ? onReset : onIssue}
            sx={{
              mb: 1,
              mt: 1,
            }}
          >
            {isIssueToSelfSuccess ? "Issue Again" : "Issue"}
          </LoadingButton>
          <Button
            variant="outlined"
            size="medium"
            fullWidth
            onClick={onBack || (issueLater && issueLater) || handleClose}
          >
            {cancelText || "Back"}
          </Button>
        </>
      }
      {hasError && (
        <Card sx={{ margin: 1, width: "100%" }}>
          <CardContent>ERROR</CardContent>
        </Card>
      )}
    </>
  );
};

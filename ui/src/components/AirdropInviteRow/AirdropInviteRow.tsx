import { Paper, TextField, Typography } from "@mui/material";
import React from "react";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { LoadingButton } from "@mui/lab";
import clx from "clsx";
import { useLedgerHooks } from "../../ledgerHooks/ledgerHooks";
import { SharedSnackbarContext } from "../../context/SharedSnackbarContext";
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  userID: {
    width: "50%",
    marginRight: theme.spacing(0.5),
  },
  status: {
    width: "20%",
    marginRight: theme.spacing(0.5),
  },
  quantity: {
    width: "20%",
    marginRight: theme.spacing(0.5),
  },
  button: {
    width: "10%",
    marginLeft: "auto",
  },
  pending: {
    color: theme.palette.warning.light,
  },
  accepted: {
    color: theme.palette.success.dark,
  },
}));

interface AirdropInviteRowProps {
  isAccepted?: boolean;
  issuer: string;
  owner: string;
  reference: string | null;
  fungible: boolean;
  symbol: string;
}


export const AirdropInviteRow: React.FC<AirdropInviteRowProps> = (props) => {
  const { isAccepted, symbol, issuer, owner, reference, fungible } = props;
  const classes = useStyles();
  const [amount, setAmount] = React.useState("");
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [hasError, setError] = React.useState<boolean>(false);
  const ledgerHooks = useLedgerHooks();
  const { openSnackbar } = React.useContext(SharedSnackbarContext);

  const onReset = () => {
    setAmount("");
  };

  const onSubmit = async () => {
    if (amount.length === 0) {
      setError(true);
      return;
    }
    setLoading(true);
    const result = await ledgerHooks.exerciseAirdrop({
      assetType: { issuer, symbol, reference, fungible },
      amount,
      owner,
    });
    if (result.isOk) {
      setLoading(false);
      setError(false);
      openSnackbar(`${amount} ${symbol} Airdropped to ${owner}`, "success");
      onReset();
    } else {
      setLoading(false);
      setError(true);
    }
  };

  const handleKeyboardEvent = (e: React.KeyboardEvent<HTMLImageElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <Paper className={classes.root}>
      <Typography className={classes.userID} sx={{wordBreak: 'break-all'}} variant="caption">
        {owner}
      </Typography>

      <Typography
        className={clx(
          classes.status,
          isAccepted ? classes.accepted : classes.pending
        )}
        variant="caption"
      >
        {isAccepted ? "Accepted" : "Pending"}
      </Typography>
      <TextField
        error={hasError}
        margin="none"
        onKeyDown={handleKeyboardEvent}
        id="quantity"
        label="Amount"
        placeholder="Amount"
        type="number"
        variant="outlined"
        size="small"
        value={amount}
        disabled={!isAccepted}
        className={classes.quantity}
        onChange={(e) => setAmount(e.currentTarget.value)}
        inputProps={{
          inputMode: "decimal",
          type: "number",
          pattern: "[0-9]*",
        }}
      />
      <LoadingButton
        loading={isLoading}
        variant="outlined"
        size="medium"
        disabled={!isAccepted}
        className={classes.button}
        onClick={onSubmit}
      >
        {hasError ? "Error" : "Send"}
      </LoadingButton>
    </Paper>
  );
};

import React from "react";
import TextField from "@mui/material/TextField";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  Typography,
  Link,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { useLedgerHooks } from "../../ledgerHooks/ledgerHooks";
import { SharedSnackbarContext } from "../../context/SharedSnackbarContext";
import { useCustomAdminParty } from "../../hooks/useCustomAdminParty";

interface InviteNewAssetOwnerFormProps {
  owner: string;
  issuer: string;
  symbol: string;
  fungible: boolean;
  //TODO add reference
  reference: string | null
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
  },
  helpMessage: {
    margin: theme.spacing(1, 0, 1),
  },
  inviteButton: {
    marginBottom: theme.spacing(0.5),
  },
}));

export const InviteNewAssetOwnerForm: React.FC<InviteNewAssetOwnerFormProps> =
  ({ issuer, reference, symbol, fungible, owner }) => {
    console.log(issuer, reference, symbol, fungible, owner)
    const classes = useStyles();
    const admin = useCustomAdminParty();
    const [hasError, setError] = React.useState(false);
    const [recipient, setRecipient] = React.useState("");
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [isSuccessful, setSuccessful] = React.useState<boolean>(false);
    const { openSnackbar } = React.useContext(SharedSnackbarContext);

    const nav = useNavigate();
    const ledgerHooks = useLedgerHooks();

    const onAdminClick = () => {
      if (!admin) {
        return;
      }
      setRecipient(admin);
    };

    const onBack = () => {
      nav(-1);
    };
    const onSubmit = async () => {
      setLoading(true);
      const result = await ledgerHooks.inviteNewAssetHolder({
        recipient,
        owner,
        assetType: { issuer, reference, fungible, symbol },
      });
      if (result.isOk) {
        setLoading(false);
        setSuccessful(true);
        setError(false);
        openSnackbar("Invitation Sent", "success");
      } else {
        setLoading(false);
        setError(true);
        setSuccessful(false);
      }
    };
    const handleKeyboardEvent = (e: React.KeyboardEvent<HTMLImageElement>) => {
      if (e.key === "Enter") {
        isSuccessful ? onReset() : onSubmit();
      }
    };
    const onReset = () => {
      setRecipient("");
      setSuccessful(false);
      setLoading(false);
    };
    return (
      <>
        <FormControl className={classes.root}>
          <TextField
            margin="dense"
            id="recipient"
            label="Recipient Party ID"
            type="text"
            disabled={isSuccessful}
            fullWidth
            autoComplete={"off"}
            variant="outlined"
            value={recipient}
            onKeyDown={handleKeyboardEvent}
            size="small"
            onChange={(e) => setRecipient(e.currentTarget.value)}
            InputProps={{
              endAdornment: (
                <Button
                  onClick={onAdminClick}
                  fullWidth
                  sx={{
                    maxWidth: "120px",
                    margin: 0,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                  variant="contained"
                  size="small"
                >
                  <Typography
                    sx={{ textTransform: "capitalize" }}
                    variant="caption"
                  >
                    Use Default Party
                  </Typography>
                </Button>
              ),
            }}
          />
          <Card
            className={classes.helpMessage}
            elevation={0}
            variant="outlined"
          >
            <Typography color="text.primary" variant="body2" p={1}>
              Here you can invite other users to create an Asset Holding Account
              for <b>{symbol}</b>, which will allow those users to accept asset
              transfers from you and to swap their assets with you. The creation
              of Asset Holding Accounts is implemented using the{" "}
              <Link
                target="_blank"
                href="https://docs.daml.com/daml/patterns/initaccept.html"
              >
                Initiate/Accept pattern.{" "}
              </Link>{" "}
            </Typography>

            <Typography color="text.primary" variant="body2" p={1}>
              An invite sent to the Default Party is accepted automatically. The
              Default Party is a bot implemented using{" "}
              <Link
                href="https://docs.daml.com/triggers/index.html"
                target="blank"
              >
                Triggers
              </Link>
              .
            </Typography>
          </Card>
          <LoadingButton
            endIcon={isSuccessful ? <CheckCircleIcon /> : <SendIcon />}
            loading={isLoading}
            fullWidth
            disabled={recipient.length === 0}
            color={isSuccessful ? "success" : undefined}
            loadingPosition="end"
            variant="outlined"
            onClick={isSuccessful ? onReset : onSubmit}
            className={classes.inviteButton}
          >
            {isSuccessful ? "Send another" : "Invite"}
          </LoadingButton>
          <Button fullWidth variant="outlined" onClick={onBack}>
            Back
          </Button>
        </FormControl>
        {hasError && (
          <Card sx={{ width: "100%", margin: 1 }}>
            <CardContent>
              Error Occured. Asset Account Cannot be shared.
            </CardContent>
          </Card>
        )}
      </>
    );
  };

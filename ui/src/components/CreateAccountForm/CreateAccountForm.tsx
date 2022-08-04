import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {
  Card,
  CardContent,
  FormControl,
  Link,
  Typography,
} from "@mui/material";
import React from "react";
import WarningIcon from "@mui/icons-material/Warning";
import { LoadingButton } from "@mui/lab";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { isMobile } from "../../platform/platform";
import { useNavigate } from "react-router-dom";

import { useLedgerHooks } from "../../ledgerHooks/ledgerHooks";
import { userContext } from "../../App";
import { createParams } from "../../utils/createParams";
interface CreateAccountFormProps {
  onSubmitSuccess?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(0, 0, 1, 0),
  },
  issuerContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(2),
  },
  issuerText: {
    marginRight: theme.spacing(0.5),
  },
  formContainer: {
    padding: isMobile() ? theme.spacing(0, 0, 0, 0) : theme.spacing(0, 0, 0, 0),
  },
  warningText: {
    display: "flex",
    alignItems: "center",
  },
}));

export const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
  onSubmitSuccess,
}) => {
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [hasError, setError] = React.useState<boolean>(false);
  const party = userContext.useParty();
  const nav = useNavigate();
  const ledgerHooks = useLedgerHooks();
  const classes = useStyles();
  const [symbol, setTicker] = React.useState<string | undefined>(undefined);
  const [reference, setReference] = React.useState<string | null>(null);
  const [isShareable, setShareable] = React.useState<boolean>(true);
  const [isFungible, setFungible] = React.useState<boolean>(true);
  const [isAirdroppable, setIsAirdroppable] = React.useState<boolean>(true);

  const onTextChange = (event: React.BaseSyntheticEvent) => {
    setTicker(event.target.value.replace(/[^\w\s]/gi, "") );
  };
  const onRefChange = (event: React.BaseSyntheticEvent) => {
    setReference(event.target.value.replace(/[^\w\s]/gi, "") );
  };

  const submit = async () => {
    if (!symbol) {
      setError(true);
      return;
    }
    setLoading(true);
    const result = await ledgerHooks.createAssetAccount({
      symbol,
      isFungible,
      reference,
      isAirdroppable,
      isShareable,
    });
    if (result.isOk) {
      onSubmitSuccess && onSubmitSuccess();
      const contractId = result.payload.contractId;
      const params = {
        issuer: party,
        symbol,
        isFungible,
        isShareable,
        isAirdroppable,
        owner: party,
        contractId,
        reference,
      };
      const paramsString = createParams(params);
      const assetProfilePath = `/asset${paramsString}`;

      nav(assetProfilePath);
    } else {
      setError(true);
      setLoading(false);
    }
  };
  return (
    <div className={classes.formContainer}>
      <Card>
        <CardContent>
          <Card elevation={0} variant="outlined" className={classes.root}>
            <Typography color="text.secondary" variant="body2" p={1}>
              Define the asset characteristics below and create your new Asset
              Holding Account. After the Asset Holding Account is created, you
              can issue new asset quantities into the account and more. Read{" "}
              <Link
                target="_blank"
                href="https://github.com/digital-asset/wallet-sample-app/blob/main/Concepts.md#wallet-daml-reference-app---concepts-and-their-implementation"
              >
                Wallet Daml Reference App - concepts and their implementation
                article for details.
              </Link>
            </Typography>
          </Card>
          <div>
            <div className={classes.issuerContainer}>
              <Typography className={classes.issuerText}>Issuer</Typography>
              <Typography
                variant="caption"
                color="primary"
                sx={{ wordBreak: "break-all" }}
              >
                {party || "Demo Party ID"}
              </Typography>
            </div>
          </div>
          <FormControl fullWidth>
            <Typography sx={{ mb: 1 }}>Symbol</Typography>
            <TextField
              margin="none"
              id="symbol"
              label="e.g. MoonCoin (Mandatory field)"
              type="text"
              autoComplete="off"
              fullWidth
              variant="outlined"
              size="small"
              error={hasError}
              value={symbol}
              onChange={(e) => onTextChange(e)}
              sx={{ marginBottom: 1 }}
            />
            <Typography variant="caption" color="text.secondary" mb={1}>
              The symbol used to identify the token that this asset account will
              hold.
            </Typography>
            <Typography sx={{ mb: 1 }}>Reference</Typography>

            <TextField
              margin="none"
              id="reference"
              label="Reference (Optional field) e.g. Limited Edition version 1 "
              type="text"
              autoComplete="off"
              fullWidth
              maxRows={4}
              multiline
              value={reference}
              variant="outlined"
              size="small"
              error={hasError}
              onChange={(e) => onRefChange(e)}
              sx={{ marginBottom: 1 }}
            />
            <Typography variant="caption" color="text.secondary" mb={1}>
              <Typography variant="caption" color="primray">
                <b>Optional field</b>
              </Typography>{" "}
              The reference is a unique text associated with the asset. It could
              be an image link or serial number.
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    onChange={(e) => {
                      setShareable(e.target.checked);
                    }}
                    defaultChecked
                  />
                }
                label="Reshareable"
              />
              <Typography variant="caption" color="text.secondary" mb={1}>
                If activated, any subsequent owners can freely invite other
                users to become an owner of the asset account as well.
                <br />
                If false, only you (the issuer) will be able to decide who to
                invite as new owners. These owners cannot subsequently invite
                further users.
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    defaultChecked
                    onChange={(e) => {
                      setIsAirdroppable(e.target.checked);
                    }}
                  />
                }
                label="Airdroppable"
              />
              <Typography variant="caption" color="text.secondary" mb={1}>
                If activated, you will be able create tokens directly in the
                owner's Asset Holding Account.
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    defaultChecked
                    onChange={(e) => {
                      setFungible(e.target.checked);
                    }}
                  />
                }
                label="Fungible"
              />
              <Typography variant="caption" color="text.secondary" mb={1}>
                If activated, the asset can be divided. If set to false, the
                asset will be <b>non-fungible</b>, meaning you will only be able
                issue a quantity of 1; The asset contract is a unique contract
                that cannot be split.
              </Typography>
            </FormGroup>
          </FormControl>
          <Card elevation={0} variant="outlined" className={classes.root}>
            <Typography
              className={classes.warningText}
              color="text.secondary"
              variant="body2"
              p={1}
            >
              <WarningIcon sx={{ marginRight: 1 }} />
              Once created, you will not be able to edit the attributes.
            </Typography>
          </Card>
          <LoadingButton
            loading={isLoading}
            fullWidth
            variant="outlined"
            onClick={submit}
            sx={{
              marginBottom: 0.5,
            }}
          >
            Create
          </LoadingButton>
        </CardContent>
      </Card>
    </div>
  );
};



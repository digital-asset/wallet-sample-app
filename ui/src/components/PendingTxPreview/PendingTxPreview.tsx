import { Typography, Box } from "@mui/material";
import React from "react";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

interface PendingTxPreviewProps {
  sender: string;
  receiver: string;
  symbol?: string;
  amount?: string;
  transactionType: keyof TransactionTypesTitles;
  isInbound: boolean;
  proposerAssetAmount?: string;
  proposerAssetSymbol?: string;
  receiverAssetAmount?: string;
  receiverAssetSymbol?: string;
}

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
  },
  amountSymbolContainer: {
    display: "flex",
  },
  marginRight: {
    marginRight: theme.spacing(0.5),
  },
  fromContainer: {
    display: "flex",
    flexDirection: "column",
  },
}));

export type TransactionTypesTitles = {
  transfer: string;
  swap: string;
  accountInvite: string;
};

export const transactionTypesTitles: TransactionTypesTitles = {
  transfer: "Transfer Request",
  swap: "Swap Request",
  accountInvite: "Account Invite",
};

export const PendingTxPreview: React.FC<PendingTxPreviewProps> = (props) => {
  const classes = useStyles();
  const { amount, sender, symbol, transactionType, isInbound, receiver } = props;
  return (
    <div className={classes.root}>
      <div>
        <Box sx={{ display: "flex" }}>
          <Typography sx={{ marginRight: "4px" }}>
            {transactionTypesTitles[transactionType]}
          </Typography>
          <div className={classes.amountSymbolContainer}>
            <div className={classes.marginRight}>
              <Typography>{amount}</Typography>
            </div>
            <div>
              <Typography>{symbol}</Typography>
            </div>
          </div>
        </Box>

        <div className={classes.fromContainer}>
          <div>
          <Typography variant='caption' sx={{ marginRight: "4px" }}>
           {isInbound ? 'from' : 'to'}
          </Typography>
          </div>
          <div>
            <Typography
              variant="caption"
              color="primary"
              sx={{ wordBreak: "break-all" }}
            >
              {isInbound ? sender : receiver}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

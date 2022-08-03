import React from "react";
import Card from "@mui/material/Card";
import SendIcon from "@mui/icons-material/Send";
import { Link } from "react-router-dom";
import { Avatar, CardActionArea, CardContent } from "@mui/material";
import { usePendingStyles } from "../PendingStyles/PendingStyles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TransactionTypesTitles } from "../PendingTxPreview/PendingTxPreview";

interface PendingRowWrapperProps {
  path: string;
  transactionType: keyof TransactionTypesTitles;
}

const transactionIcons = {
  transfer: <SendIcon />,
  swap: <SwapHorizIcon />,
  accountInvite: <AccountBalanceWalletIcon />,
};

export const PendingRowWrapper: React.FC<PendingRowWrapperProps> = ({
  children,
  path,
  transactionType,
}) => {
  const classes = usePendingStyles();
  return (
    <Card className={classes.card}>
      <CardActionArea component={Link} to={path}>
        <CardContent>
          <div className={classes.symbolTextContainer}>
            <Avatar className={classes.avatar}>
              {transactionIcons[transactionType]}
            </Avatar>
            {children}
            <ChevronRightIcon sx={{ marginRight: 1, marginLeft: "auto" }} />
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

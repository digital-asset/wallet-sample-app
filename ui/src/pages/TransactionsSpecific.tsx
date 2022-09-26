import { Box, Typography, IconButton } from "@mui/material";
import React from "react";
import { usePageStyles } from "./AssetProfilePage";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../platform/platform";
import { useGetAllOutTransfer} from "../ledgerHooks/ledgerHooks"



import { useLocation } from "react-router-dom";
import { TransferRow} from "../components/TransactionRow/TransactionRow";

export const TransactionsSpecific: React.FC = () => {
  const nav = useNavigate();

  const classes = usePageStyles();
  const onClick = () => {
    nav(-1);
  };
// getting query params
  const search = useLocation().search;
  const symbol = new URLSearchParams(search).get('symbol');
//console.log("Symbol",symbol)

  const {contracts } = useGetAllOutTransfer();



const transactionRows = contracts.map((contract) => (
  contract.payload.asset.symbol===symbol?
  <TransferRow
    key={contract.contractId}
    contractId={contract.contractId}
    issuer={contract.payload.asset.issuer}
    reference={contract.payload.reference}
    symbol={contract.payload.asset.symbol}
    isShareable={contract.payload.resharable}
    transferType={contract.payload.transferType}
    from={contract.payload.from}
    to={contract.payload.to} owner={""}
    quantity={contract.payload.quantity}  
    timeStamp={contract.payload.time}
    />:null
));


  return (
    <div className={classes.root}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box
          margin={1}
          width="100%"
          flexDirection="row"
          display="flex"
          alignItems="center"
          justifyContent="start"
        >
          {isMobile() && (
            <Box position="absolute">
              <IconButton color="primary" onClick={onClick}>
                <ArrowBackIosNewIcon />
              </IconButton>
            </Box>
          )}
          <Box flexGrow="1" textAlign="center">
            <Typography
              color="primary"
              variant="h5"
              sx={{ flexGrow: 1, marginLeft: "auto" }}
            >
              Transaction History for {symbol}
                
            </Typography>
          </Box>
  

        </Box>
        <div className={classes.cardContent}>
          {transactionRows}
        </div>
      </Box>
    </div>
  );
};
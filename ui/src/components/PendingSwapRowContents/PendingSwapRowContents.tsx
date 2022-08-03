import React from "react";
import Typography from "@mui/material/Typography";
import clx from "clsx";
import { Divider } from "@mui/material";
import { usePendingStyles } from "../PendingStyles/PendingStyles";

export interface PendingSwapRowProps {
  inboundTicker: string;
  inboundQuantity: string;
  outboundTicker: string;
  outboundQuantity: string;
  sender: string;
  isInbound?: boolean;
  receiver: string;
  isSwapDetailsPage?: boolean;
  outboundAssetCid?: string;
  requestedAssetTxPreApprovalCid?: string;
}

interface PendingSwapRowContentsProps {
  proposer: string;
  receiver: string;
  proposerAssetAmount: string;
  proposerAssetSymbol: string;
  receiverAssetAmount: string;
  receiverAssetSymbol: string;
  isSwapDetailsPage: boolean;
  isInbound: boolean;
}

export const PendingSwapRowContents: React.FC<PendingSwapRowContentsProps> = (
  props
) => {
  const {
    proposer,
    receiver,
    proposerAssetAmount,
    proposerAssetSymbol,
    receiverAssetAmount,
    receiverAssetSymbol,
    isSwapDetailsPage,
    isInbound,
  } = props;
  const classes = usePendingStyles();
  const inboundMessage = (
    <>
      <div>
        <div className={classes.divider} />
        {!isSwapDetailsPage && (
          <Typography
            variant="body2"
            className={clx(classes.text, classes.sender)}
            color="text.secondary"
          >
            {proposer}
          </Typography>
        )}
        <Divider className={classes.divider} />
        <Typography
          variant="body2"
          color="text.secondary"
          className={classes.text}
        >
          {!isSwapDetailsPage ? "wants to swap" : "swapping"}
        </Typography>
        <Divider className={classes.divider} />

        <div className={classes.inboundForOutboundContainer}>
          <Typography
            variant="body2"
            className={clx(classes.text, classes.inboundQuantity)}
            color="text.secondary"
          >
            {proposerAssetAmount}
          </Typography>
          <Typography
            variant="body2"
            className={clx(classes.text, classes.inboundTicker)}
            color="text.secondary"
          >
            {proposerAssetSymbol}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className={classes.text}
          >
            for
          </Typography>
          <Typography
            variant="body2"
            className={clx(classes.text, classes.outboundQuantity)}
            color="text.secondary"
          >
            {receiverAssetAmount}
          </Typography>
          <Typography
            variant="body2"
            className={clx(classes.text)}
            color="primary"
          >
            {receiverAssetSymbol}
          </Typography>
        </div>
        <div className={classes.divider} />
      </div>
    </>
  );

  const outboundMessage = (
    <>
      <div>
        <div className={classes.divider} />
        <Typography
          variant="body2"
          color="text.secondary"
          className={classes.text}
        >
          {isSwapDetailsPage ? "swapping" : "you want to swap with"}
        </Typography>
        <Divider className={classes.divider} />
        {!isSwapDetailsPage && (
          <>
            <Typography
              variant="body2"
              className={clx(classes.text, classes.sender)}
              color="text.secondary"
            >
              {receiver}
            </Typography>
            <Divider className={classes.divider} />
          </>
        )}

        <div className={classes.inboundForOutboundContainer}>
          <Typography
            variant="body2"
            className={clx(classes.text, classes.outboundQuantity)}
            color="text.secondary"
          >
            {proposerAssetAmount}
          </Typography>
          <Typography
            variant="body2"
            className={clx(classes.text)}
            color="primary"
          >
            {proposerAssetSymbol}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className={classes.text}
          >
            for
          </Typography>
          <Typography
            variant="body2"
            className={clx(classes.text, classes.inboundQuantity)}
            color="text.secondary"
          >
            {receiverAssetAmount}
          </Typography>
          <Typography
            variant="body2"
            className={clx(classes.text, classes.inboundTicker)}
            color="text.secondary"
          >
            {receiverAssetSymbol}
          </Typography>
        </div>
        <div className={classes.divider} />
      </div>
    </>
  );

  return <>{isInbound ? inboundMessage : outboundMessage}</>;
};

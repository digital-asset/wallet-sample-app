import React from "react";
import { LoadingButton } from "@mui/lab";
import { useGetUrlParams } from "../../hooks/useGetAllUrlParams";
import { usePageStyles } from "../../pages/AssetProfilePage";
import { SharedSnackbarContext } from "../../context/SharedSnackbarContext";

interface AcceptRejectCancelProps {
  acceptChoice?:  () => Promise<{
    isOk: boolean;
    payload: any;
  }>;
  cancelChoice: () => Promise<{
    isOk: boolean;
    payload: any;
  }>;
  rejectChoice: () => Promise<{
    isOk: boolean;
    payload: any;
  }>;
}

const messages = {
  accept: "transaction accepted",
  reject: "transaction rejected",
  cancel: "transaction cancelled",
  failed: "transaction failed"
};

export const AcceptRejectCancel: React.FC<AcceptRejectCancelProps> = (
  props
) => {
  const { acceptChoice, cancelChoice, rejectChoice } = props;
  const params = useGetUrlParams();
  const isInbound = params.isInbound as boolean;
  const { openSnackbar } = React.useContext(SharedSnackbarContext);

  const [isLoading, setLoading] = React.useState<string | undefined>(undefined);
  const [success, setSuccess] =
    React.useState<"accept" | "reject" | "cancel" | undefined>();
  const classes = usePageStyles();

  const onClick = async (
    action: "cancel" | "reject" | "accept",
    choice?: () => Promise<{
      isOk: boolean;
      payload: any;
    }>
  ) => {
    if(!choice){
      return;
    }
    setLoading(action);
    const result = await choice();
    if (result.isOk) {
      setSuccess(action);
      setLoading(undefined);
      openSnackbar(messages[action], action === "accept" ? "success" : "info");
    } else {
      setSuccess(undefined);
      setLoading(undefined);
      openSnackbar(messages['failed'], "error");
    }
  };

  return (
    <>
      {success === undefined && (
        <div className={classes.actions}>
          {isInbound && (
            <LoadingButton
              loadingPosition="end"
              loading={isLoading === "accept"}
              onClick={() => onClick("accept", acceptChoice)}
              fullWidth
              sx={{ marginLeft: 1, marginRight: 1 }}
              variant="outlined"
            >
              Accept Request
            </LoadingButton>
          )}
          {isInbound && (
            <LoadingButton
              loadingPosition="end"
              loading={isLoading === "reject"}
              fullWidth
              onClick={() => onClick("reject", rejectChoice)}
              sx={{ marginRight: 1 }}
              variant="outlined"
            >
              Reject Request
            </LoadingButton>
          )}
          {!isInbound && success !== "cancel" && (
            <LoadingButton
              loadingPosition="end"
              loading={isLoading === "cancel"}
              onClick={() => {
                onClick("cancel", cancelChoice);
              }}
              fullWidth
              sx={{ margin: 1 }}
              variant="outlined"
            >
              Cancel Request
            </LoadingButton>
          )}
        </div>
      )}
    </>
  );
};

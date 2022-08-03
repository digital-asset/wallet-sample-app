import { AlertColor } from '@mui/material';
import React from 'react'; 
import { SharedSnackbarContext } from '../context/SharedSnackbarContext';
import { useGetAssetInviteRequests, useGetAssetTransfers, useGetAssetSwapRequests } from '../ledgerHooks/ledgerHooks';
import { usePrevious } from '../utils/usePrevious';

export const useTxNotifications = () => {
  const { contracts: inviteContracts } = useGetAssetInviteRequests(true);
  const { contracts: transferContracts } = useGetAssetTransfers(true);
  const { contracts: swapContracts } = useGetAssetSwapRequests(true);
  const { openSnackbar } = React.useContext(SharedSnackbarContext);
  const prevInvites = usePrevious(inviteContracts.length);
  const prevTranfers = usePrevious(transferContracts.length);
  const prevSwaps = usePrevious(swapContracts.length);
  React.useEffect(() => {
    if (inviteContracts.length > prevInvites) {
      openSnackbar(`Asset Account Invite`, "info" as AlertColor, true);
    }
    if (transferContracts.length > prevTranfers) {
      openSnackbar(`Transfer Request Received`, "info" as AlertColor, true);
    }
    if (swapContracts.length > prevSwaps) {
      openSnackbar(`Swap Request Received`, "info" as AlertColor, true);
    }
  }, [
    inviteContracts.length,
    transferContracts.length,
    swapContracts.length,
    openSnackbar,
    prevInvites,
    prevSwaps,
    prevTranfers,
  ]);
}
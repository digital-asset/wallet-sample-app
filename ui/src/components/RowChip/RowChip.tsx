import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export const chipColors: any = {
  send: '#4caf50',
  swap:'#ff9800', 
  invite: '#00bcd4', 
  issuer: '#e91e63'
}
type IconMap = {
  [key: string]: JSX.Element,
}
const iconMap: IconMap = {
  send: <ArrowBackIcon/>, 
  swap: <SwapHorizIcon/>,
  invite: <AccountBalanceWalletIcon/>
}

interface RowChipProps {
  label?: string, 
  requestType: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginRight: theme.spacing(1)
  }
}))


export const RowChip: React.FC<RowChipProps> = ({label, requestType}) =>  {
  const classes = useStyles();
  return (
    <Stack direction="row" spacing={1} className={classes.root}>
      <Chip size={'small'} icon={iconMap[requestType]} label={label} color={'primary'} sx={{backgroundColor: chipColors[requestType]}} />
    </Stack>
  );
}

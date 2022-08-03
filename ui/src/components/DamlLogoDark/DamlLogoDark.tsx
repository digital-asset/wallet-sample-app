import { Icon } from '@mui/material';
import React from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import DarkDamlLogo from '../../daml-logo-dark.svg'

const useStyles = makeStyles((theme: Theme) => ({
  image: {
    height: '25px', 
    width: '25px', 
    marginRight: theme.spacing(1)
  }, 
  root: {
    marginRight: theme.spacing(1)
  }
}))
export const DamlLogoDark: React.FC = () => {
  const classes = useStyles();
  return (
    <Icon className={classes.root}>
      <img alt='daml' className={classes.image} src={DarkDamlLogo} />
    </Icon>

  )
}
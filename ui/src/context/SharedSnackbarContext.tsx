import React from 'react';
import { Alert, AlertColor, Button, Snackbar, Typography } from '@mui/material';
import { isMobile } from '../platform/platform';
import { Link } from 'react-router-dom';

interface SharedSnackbarContextProps {
  isOpen: boolean;
  message: string;
  severity?: AlertColor;
  closeSnackbar: () => void;
  openSnackbar: (message: string, severity?: AlertColor, enableViewButton?: boolean) => void;
}
interface SnackbarState {
  isOpen: boolean;
  message: string;
  severity?: AlertColor;
  enableViewButton?: boolean;
}

export const SharedSnackbarContext = React.createContext<SharedSnackbarContextProps>({} as SharedSnackbarContextProps);

export const SharedSnackbarProvider: React.FC<unknown> = ({ children }) => {
  const [state, setState] = React.useState<SnackbarState>({
    isOpen: false,
    message: '',
    severity: undefined
  })
  const openSnackbar = (message: string, severity?: AlertColor, enableViewButton?: boolean) => {
    setState((state) => ({ ...state, isOpen: true, message, severity: severity , enableViewButton}))
  }
  const closeSnackbar = () => {
    setState((state) => ({ ...state, isOpen: false, message: '', severity: undefined }))
  }

  return (
    <SharedSnackbarContext.Provider value={{
      openSnackbar,
      closeSnackbar,
      isOpen: state.isOpen,
      message: state.message,
      severity: state.severity
    }}>
      <Snackbar
        anchorOrigin={{
          vertical: isMobile() ? 'top' : 'bottom',
          horizontal: 'center',
        }}
        sx={isMobile() ? { top: { xs: 64, sm: 0 } } : undefined}

        open={state.isOpen}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        action={[

        ]}
      >
        <Alert variant='filled' onClose={closeSnackbar} sx={{ width: '100%', display: 'flex', alignItems: 'center' }} severity={state.severity}>
          <Typography >{state.message}
            {state.enableViewButton && <Button onClick={() => closeSnackbar()} variant='outlined' size='small' sx={{ textDecoration: 'none', color: 'white', borderColor: 'white', marginLeft: 1 }} component={Link} to={'/pending'}>
              View
            </Button>}
          </Typography>
        </Alert>

      </Snackbar>

      {children}
    </SharedSnackbarContext.Provider>
  )

}

export const SharedSnackbarConsumer = SharedSnackbarContext.Consumer
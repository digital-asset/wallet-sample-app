import { Box, CssBaseline, Toolbar } from "@mui/material";
import React from "react";
import { TopAppBar } from "./components/TopAppBar/TopAppBar";
import { ThemeProvider } from "@mui/material/styles";
import { HashRouter } from "react-router-dom";
import { isMobile } from "./platform/platform";
import Credentials from "./Credentials";
import { LoginPage } from "./pages/LoginPage";
import { RightDrawer } from "./components/RightDrawer/RightDrawer";
import DamlHub, {
  damlHubLogout,
  isRunningOnHub,
  usePublicParty,
  usePublicToken,
} from "@daml/hub-react";
import { SharedSnackbarProvider } from "./context/SharedSnackbarContext";
import { theme } from "./Theme";
import { createLedgerContext } from "@daml/react";
import { MainScreen } from "./components/MainScreen/MainScreen";

// Context for the party of the user.
export const userContext = createLedgerContext();
// Context for the public party used to query user aliases.
// On Daml hub, this is a separate context. Locally, we have a single
// token that has actAs claims for the user’s party and readAs claims for
// the public party so we reuse the user context.
export const publicContext = isRunningOnHub()
  ? createLedgerContext()
  : userContext;

export const App: React.FC = () => {
  const [credentials, setCredentials] =
    React.useState<Credentials | undefined>();

  const onLogout = () => {
    damlHubLogout();
    setCredentials(undefined);
  };

  const Wrapper: React.FC = ({ children }) => {
    return (
      <HashRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <TopAppBar party={credentials?.party} onLogout={onLogout} />
          <SharedSnackbarProvider>
            <Toolbar />
            {children}
            <Box paddingBottom={10} />
          </SharedSnackbarProvider>
        </ThemeProvider>
      </HashRouter>
    );
  };
  if (credentials) {
    const PublicPartyLedger: React.FC = ({ children }) => {
      const publicToken = usePublicToken();
      const publicParty = usePublicParty();
      if (publicToken && publicParty) {
        return (
          <publicContext.DamlLedger
            token={publicToken.token}
            party={publicParty}
          >
            {children}
          </publicContext.DamlLedger>
        );
      } else {
        return <h1>Loading ...</h1>;
      }
    };
    const Wrap: React.FC = ({ children }) =>
      isRunningOnHub() ? (
        <DamlHub token={credentials.token}>
          <PublicPartyLedger>{children}</PublicPartyLedger>
        </DamlHub>
      ) : (
        <div>{children}</div>
      );
    return (
      <Wrap>
        <Wrapper>
          <userContext.DamlLedger
            token={credentials.token}
            party={credentials.party}
            user={credentials.user}
          >
            <Box sx={{ display: "flex" }}>
              {/* Space for the left side bar on desktop */}
              {!isMobile() && <Box sx={{ width: "200px", flexShrink: "0" }} />}
              <MainScreen getPublicParty={credentials.getPublicParty} />
              {!isMobile() && <RightDrawer isOpen={true} />}
            </Box>
          </userContext.DamlLedger>
        </Wrapper>
      </Wrap>
    );
  } else {
    return (
      <Wrapper>
        <LoginPage onLogin={setCredentials} />
      </Wrapper>
    );
  }
};

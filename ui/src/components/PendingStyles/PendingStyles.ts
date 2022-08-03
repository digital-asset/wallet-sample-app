import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const usePendingStyles = makeStyles((theme: Theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(1),
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
  },
  actions: {
    marginLeft: "auto",
    marginRight: theme.spacing(1),
  },
  button: {
    marginBottom: theme.spacing(0.5),
    marginRight: theme.spacing(1),
  },
  quantity: {
    backgroundColor: "green",
  },
  text: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    wordBreak: 'break-all'
  },
  sender: {
    color: theme.palette.text.primary,
  },
  assetName: {
    color: theme.palette.primary.main,
  },
  symbolTextContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  moreButton: {
    marginLeft: "auto",
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
  inboundTicker: {
    color: theme.palette.primary.main,
  },
  inboundQuantity: {
    color: "green",
  },
  outboundTicker: {
    color: "red",
  },
  outboundQuantity: {
    color: "red",
  },
  divider: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  inboundForOutboundContainer: {
    display: "flex",
    flexDirection: "row",
  },
  avatar: {
    marginRight: theme.spacing(1.5),
  },
}));

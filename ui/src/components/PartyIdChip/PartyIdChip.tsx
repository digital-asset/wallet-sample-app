import React from "react";
import Popover from "@mui/material/Popover";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckIcon from "@mui/icons-material/Check";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router";
import { demoPartyId } from "../TopAppBar/TopAppBar";
import { useClipboardCopy } from "../../hooks/useClipboardCopy";

interface PartyIdChipProps {
  onLogout: () => void;
  party: string;
}

export const PartyIdChip: React.FC<PartyIdChipProps> = (props) => {
  const { onLogout, party } = props;
  const navigate = useNavigate();
  const { copy, isCopied } = useClipboardCopy(party);
  const onLogoutClick = () => {
    onLogout();
    navigate("/", { replace: true });
  };

  const [anchorEl, setAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<Element, MouseEvent>) => {
    // TODO
    // @ts-ignore
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <Box sx={{ flexGrow: 0, marginLeft: "auto" }}>
      <Tooltip title="View Party ID">
        <Chip
          icon={<AccountCircleIcon />}
          onClick={handleClick}
          label={party.length < 10 ? party + demoPartyId : party}
          sx={{ maxWidth: "230px" }}
          deleteIcon={<AccountCircleIcon />}
        />
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        elevation={10}
      >
        <Card
          sx={{
            width: "300px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent>
            <Typography variant="caption">Party ID:</Typography>
            <Card variant="outlined" sx={{ mb: 1, mt: 1, borderRadius: 1 }}>
              <CardActionArea onClick={copy} sx={{ padding: 1 }}>
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{ wordBreak: "break-all" }}
                >
                  {party?.length < 10 ? party + demoPartyId : party}
                </Typography>
                <IconButton size="small">
                  {isCopied ? <CheckIcon /> : <ContentCopyIcon />}
                </IconButton>
              </CardActionArea>
            </Card>
            <Card variant="outlined" sx={{ padding: 1 }}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                mb={1}
              >
                <InfoIcon sx={{ marginRight: 1 }} color="primary" />
                <Typography variant="caption">
                  <i>What's a Party ID ?</i>
                </Typography>
              </Box>
              <Typography
                color="text.primary"
                variant="caption"
                sx={{ alignItems: "center" }}
              >
                A Party ID is used to identify you in a variety of transactions
                where you are a counter party. For example: transfers, swaps and
                asset holding invites.
              </Typography>
            </Card>
            <Button
              color="error"
              fullWidth
              variant="outlined"
              sx={{ marginTop: "8px" }}
              onClick={onLogoutClick}
            >
              {"Logout"}
            </Button>
          </CardContent>
        </Card>
      </Popover>
    </Box>
  );
};

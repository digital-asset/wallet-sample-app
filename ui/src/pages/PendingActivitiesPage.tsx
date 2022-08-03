import Box from "@mui/material/Box";
import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { isMobile } from "../platform/platform";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { PendingActivities } from "../components/PendingActivities/PendingActivities";
import { Link } from "react-router-dom";
import { Card, Typography } from "@mui/material";
import {
  useGetUrlParams,
} from "../hooks/useGetAllUrlParams";
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: isMobile() ? theme.spacing(0, 0, 0, 0) : theme.spacing(1),
  },
}));
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const BasicTabs: React.FC<unknown> = () => {
  const params = useGetUrlParams();
  const direction = params.direction as string;
  const [value, setValue] = React.useState(!direction  ? 0 : 1);
  React.useEffect(() => {
    if (!direction) {
      setValue(0);
      return;
    }
    if (direction === "inbound") {
      setValue(0);
    } else {
      setValue(1);
    }
  }, [direction]);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ marginBottom: 1, borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          variant={isMobile() ? "fullWidth" : undefined}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="Inbound"
            {...a11yProps(0)}
            component={Link}
            to={"/pending?direction=inbound"}
          />
          <Tab
            component={Link}
            to={"/pending?direction=outbound"}
            label="Outbound"
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <Box
        sx={{ marginLeft: isMobile() ? 1 : 0, marginRight: isMobile() ? 1 : 0 }}
      >
        <TabPanel value={value} index={0}>
          <Card elevation={0} variant="outlined" sx={{ mb: 1 }}>
            <Typography color="text.primary" variant="body2" p={1}>
              Pending inbound / outbound requests for asset transfers, swaps,
              and Asset Holding Account invitations are displayed here. Inbound
              page displays the requests other users send to you, which you can{" "}
              <b>accept</b> or <b>reject</b>.
            </Typography>
          </Card>
          <PendingActivities isInbound={true} />
        </TabPanel>
        <TabPanel value={value} index={1}>
        <Card elevation={0} variant="outlined" sx={{ mb: 1 }}>
          <Typography color="text.primary" variant="body2" p={1}>
            Outbound page displays the requests you sent to other users. You can
            cancel an outbound request while it’s pending acceptance or
            rejection by the recipient.
          </Typography>
        </Card>
          <PendingActivities isInbound={false} />
        </TabPanel>
      </Box>
    </>
  );
};

export const PendingActivitiesPage: React.FC = () => {
  const classes = useStyles();

  return (
    <Box component="main" sx={{ flexGrow: 1 }} className={classes.root}>
      <BasicTabs />
    </Box>
  );
};

import React from "react";

import { Card, CardContent, Typography, Link } from "@mui/material";
export const WelcomeMessage: React.FC = () => {
  return (
    <Card sx={{ margin: 1 }}>
      <CardContent>
        <Typography color="primary" sx={{ fontWeight: "bold" }} variant="h6">
          Welcome To the Wallet Ref App
        </Typography>
        <Typography>
          an open-source digital asset wallet powered by{" "}
          <Link target="_blank" href="https://www.digitalasset.com/developers">
            Daml
          </Link>{" "}
          smart contracts and{" "}
          <Link
            target="_blank"
            href="https://docs.daml.com/app-dev/bindings-ts/daml-react/index.html"
          >
            Daml/React Javascript library
          </Link>{" "}
          and deployed in{" "}
          <Link href="https://hub.daml.com/" target="_blank">
            Daml Hub
          </Link>
          . This app provides developers with a working example of how to
          implement essential workflows related to digital assets such as asset
          issuance, airdrop, transfer and atomic swaps. We assume the developer
          already has basic knowledge of Daml. You can view the full repo{" "}
          <Link
            href="https://github.com/digital-asset/wallet-sample-app"
            target="_blank"
          >
            here
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
};

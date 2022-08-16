import React from "react";

import { Card, CardContent, Typography, Link as LinkBtn } from "@mui/material";
export const GettingStartedMessage: React.FC = () => {
  return (
    <>
      <Card sx={{ margin: 1 }}>
        <CardContent>
          <Typography color="primary" sx={{ fontWeight: "bold" }} variant="h6">
            Getting Started
          </Typography>
          <Typography>
          
            If you haven't watched this <LinkBtn
              sx={{ textDecoration: "none" }}
              target="_blank"
              href="https://myinteractive.video/w/fgbRdGusDeoo"
            >
              walkthrough video
            </LinkBtn> yet, first watch it to get a feel for what this app will show you. Then dive into the guide below. This guide will walk you through the following:
          </Typography>
          <br />
          <Typography>
            <b>1.</b> Becoming an ExampleToken asset holder
            <i> (used for the swap workflow later on)</i>
          </Typography>
          <Typography>
            <b>2.</b> Creating a new asset class and a new AssetHoldingAccount.
          </Typography>
          <Typography>
            <b>3.</b>Issuing the asset.
          </Typography>
          <Typography>
            <b>4.</b> Inviting others to become asset holders (so that they can
            send or swap the newly created tokens with you)
          </Typography>
          <Typography>
            <b>5.</b> Swapping your newly created asset with the ExampleToken.
          </Typography>
          <Typography>
            <b>6.</b> Sending assets to other users
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ margin: 1 }}>
        <CardContent>
          <Typography color="primary" sx={{ fontWeight: "bold" }} variant="h6">
            1. Requesting ExampleToken
          </Typography>
          <Typography>To receive ExampleTokens via airdrop:</Typography>
          <br />
          <Typography>
            <b>1.</b> Check your <b>Pending Activities</b> in the menu on the
            left side of the screen.
          </Typography>
          <br />
          <Typography>
            <b>2.</b> Accept the Asset Holding Account Invitation in Pending
            Activities.
          </Typography>
          <Typography>
            By accepting the invitation, you are opening an ExampleToken
            AssetHoldingAccount, and giving the issuer the right to airdrop
            (create the asset directly in your wallet) the tokens to you.{" "}
          </Typography>
          <br />
          <Typography>
            <b>3. </b>Return to <b>My Asset Accounts</b>
          </Typography>
          <br />
          <Typography>
            <b>4.</b> Click <b>Request Airdrop</b> and specify an amount of
            ExampleTokens you would like to receive. You should see your updated
            balance immediately.
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ margin: 1 }}>
        <CardContent>
          <Typography color="primary" sx={{ fontWeight: "bold" }} variant="h6">
            2. Creating an AssetHoldingAccount
          </Typography>
          <Typography>
            The AssetHoldingAccount allows the owner to issue tokens, create
            swaps or transfer the associated assets to another user.
          </Typography>
          <br />
          <Typography>
            <b>1.</b> Click <b>Create</b> in the left menu.
          </Typography>
          <br />
          <Typography>
            <b>2.</b> Define the characteristics of the tokens that will be
            issued from this account: the symbol (name), optional reference, and
            whether they are fungible, reshareable, or airdroppable.
          </Typography>
          <br />
          <Typography>
            <b>3.</b> Click the <b>Create</b> button at the bottom of the
            screen.
          </Typography>
          <br />
          <Typography>
            <i>
              Note: Assets and AssetHoldingAccounts are linked by common
              properties: issuer, symbol, resharable, airdroppable, fungible.
            </i>
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ margin: 1 }}>
        <CardContent>
          <Typography color="primary" sx={{ fontWeight: "bold" }} variant="h6">
            3. Issue / Airdrop Assets
          </Typography>
          <Typography>
            The new asset account will have a starting balance of 0.
          </Typography>
          <Typography>
            As an issuer, you can issue new amounts into your account. Click{" "}
            <b>Issue / Airdrop</b>.
          </Typography>
          <br />
          <Typography>
            <b>Issue To Self</b> <br />
            means the assets will have the owner field set as your party ID. We
            are creating the assets directly in your wallet (you can choose to
            send or swap them later).
          </Typography>
          <br />
          <Typography>
            <b>Airdrop</b>
            <br /> means you will be issuing assets directly in another users
            wallet. <br />
            <br />
            In order to airdrop assets, the recipient must first grant you
            permission to create the assets in their wallet. An assetHolding
            invitation, or in this case,{" "}
            <b>an airdrop invitation is required</b>.
          </Typography>
          <br />
          <Typography>
            Specify an amount to issue, and click <b>Issue</b>. You can always
            issue more later.
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ margin: 1 }}>
        <CardContent>
          <Typography color="primary" sx={{ fontWeight: "bold" }} variant="h6">
            4. Invite New Asset Owner
          </Typography>
          <Typography>
            Next, we want to swap some of our newly issued assets with another
            user (In this example we will use the default party). In order for
            the recipient to accept your swap request, you must invite the
            recipient to be an asset holder for the particular asset.
          </Typography>
          <br />
          <Typography>
            <b>1. </b>Go to <b>My Asset Accounts</b> in the left menu.
          </Typography>
          <br />
          <Typography>
            <b>2. </b>Select the asset you want to share, and click{" "}
            <b>Invite</b>.
          </Typography>
          <br />
          <Typography>
            <b>3. </b>Specify the Party Id (Or use the default party), and click{" "}
            <b>Invite</b>
          </Typography>
          <br />
          <Typography>
            Once the user accepts your invitation, the AssetHoldingAccounts will
            be created.
          </Typography>
          <br />
          <Typography>
            <i>
              Note: If the account is resharable, any account owner can invite
              other users to create AssetHoldingAccounts for this asset. If the
              account is not resharable, only the issuer can invite other users
              to create AssetHoldingAccounts for this asset.{" "}
            </i>{" "}
          </Typography>
          <br />
          <Typography>
            If later on, you decide that you don't want to share this asset
            account, you can go to <b>Pending Activities</b> {">"}{" "}
            <b>Outbound Requests</b> and cancel the invitation, provided that it
            is hasn't been accepted by the recipient yet.
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ margin: 1 }}>
        <CardContent>
          <Typography color="primary" sx={{ fontWeight: "bold" }} variant="h6">
            5. Swap
          </Typography>
          <Typography>
            Let's try and swap your newly issued asset with some ExampleTokens.
            What you'll be creating here is a swap request. The assets are not
            swapped immediately, but rather a request to swap is created. The
            swap occurs only when and if the recipient agrees to the request.{" "}
          </Typography>
          <br />
          <Typography>
            <b>1.</b> Navigate to the asset that you want to swap.
          </Typography>
          <br />
          <Typography>
            <b>2. </b>First ensure you have enough balance of the token you want
            to swap. If not, you can issue yourself additional quantities.
          </Typography>
          <br />
          <Typography>
            <b>3. </b>Click <b>Swap</b>
          </Typography>
          <br />
          <Typography>
            <b>4. </b>
            Specify the party ID of the recipient. For this example, we can use
            the Party ID of the default counterparty, so click{" "}
            <b>use default party</b> in the recipient field.
          </Typography>
          <br></br>
          <Typography>
            <b>5.</b> Specify the amount of your token that you want to swap
            out, the asset type you want to receive, and the quantity. Perhaps
            you believe your asset is worth 1 ExampleToken, or 100
            ExampleTokens.
          </Typography>
          <Typography>
            If later you want to change the swap terms, you will need to cancel
            the swap proposal and create a new one with the new terms.
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ margin: 1 }}>
        <CardContent>
          <Typography color="primary" sx={{ fontWeight: "bold" }} variant="h6">
            6. Send
          </Typography>
          <Typography>
            Ensure the recipient has the Asset Holding Account of the asset you
            want to send. This must be done by contacting the recipient
            directly.
          </Typography>
          <br />
          <Typography>
            <b>1. </b>Select the asset that you want to send from{" "}
            <b>My Asset Account</b>.
          </Typography>
          <br></br>
          <Typography>
            <b>2. </b>Specify the Party ID and the amount you want to send
          </Typography>
          <br></br>
          <Typography>
            <b>3. </b> Click <b>Send</b>
          </Typography>
          <br />
          <Typography>
            <i>
              Important: you can send tokens to anyone, regardless of if they
              have the assetHoldingAccount. However in order for the recipient
              to receive the tokens, the user needs to have that asset account
            </i>
          </Typography>
          <br />
          <Typography>
            The balance for this asset should have decreased by the amount
            you've sent.
          </Typography>
          <br />
          <Typography>
            If you decide later on, and assuming the recipient has not accepted
            the send request, you can cancel it by going to{" "}
            <b>Pending activities</b> {">"} <b>outbound</b>, and click on the
            asset that you are sending, and click <b>Cancel</b>.
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

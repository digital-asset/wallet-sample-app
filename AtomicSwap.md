### Atomic swap implementation in Wallet Daml Reference App

Financial and other transactions involve the exchange of items between parties. One or more of these items may be cash or other financial assets. E.g. a seller on Amazon ships the goods to the buyer, and the buyer sends the payment for these goods to the seller. This workflow is commonly referred to as “delivery vs. payment” or DvP. Simply put this means the parties involved in the transaction swap the items they agreed to exchange to settle the transaction.
In procedural programming languages there’s always a possibility that part of the code will execute while another part will fail for some reason. This makes the task of ensuring that delivery without payment (or vice versa - payment without delivery) does not happen rather tricky. The lack of delivery vs. payment guarantee results in the necessity to employ costly reconciliation and dispute resolution services.
In Daml transactions get committed to the ledger atomically. In other words a transaction is guaranteed to either succeed or fail as a whole with all actions that comprise the transaction either all succeeding or all failing. This is particularly useful in implementation of delivery vs. payment workflow, allowing us to eliminate the counterparty risk - one of the principal risks in financial markets.
The workflow, where two parties exchange their assets in one transaction, which is guaranteed to wholly succeed or wholly fail, is called an atomic swap.
In this article we explore how atomic swap workflow is implemented in the Wallet Daml Reference App and the rationale behind this implementation.

In addition to `Asset` and `AssetHoldingAccount` templates described in [Wallet Daml Reference App - concepts and their implementation](Concepts.md) article, atomic swap workflow utilizes 3 more templates named `Trade`, `TransferPreApproval` and `AssetInSwap`. The workflow in an atomic swap starts with party A (Alice) proposing to party B (Bob) to trade a specified quantity of an asset that Alice owns for a specified quantity of another asset owned by Bob. This is done by calling `Create_Trade` choice on `AssetHoldingAccount` contract corresponding to the asset type that Alice wants to trade. Since the Wallet Daml Reference App implements [UTXO](UTXO.md), `Create_Trade` choice takes as an argument the list of `Asset` contract IDs, from which the amount of asset that party A wants to trade can be created. In the simplest client side implementation one can pass to the `Create_Trade` choice the entire account balance - the collection of all `Asset` contracts corresponding to the `AssetHoldingAccount` contract. The `Create_Trade` choice will merge these `Asset` contracts and split the amount of asset specified in the `offeredAssetAmount` field. The last argument of `Create_Trade` choice is `requestedAsset`. It is a Daml record of the type `Asset`, which provides information about the asset type and the amount party A requests in return for the asset that party A wants to trade. The owner of the `requestedAsset` is the recipient of the trade proposal, i.e. party B.

    nonconsuming choice Create_Trade : ContractId Trade
      with
        assetCids : [ContractId Asset]
        offeredAssetAmount : Decimal
        requestedAsset : Asset

The return value of the `Create_Trade` choice is a `Trade` contract, which represents the trade proposal from party A to party B to swap the specified asset owned by Alice for the specified asset owned by Bob.

    template Trade
    with
        proposer : Party
        receiver : Party
        offeredAssetCid : ContractId AssetInSwap
        requestedAssetsTxPreApprovalCid : ContractId TransferPreApproval
    where
        signatory proposer
        observer receiver

When the `Trade` contract is created, the proposer is the party calling the `Create_Trade` choice on the `AssetHoldingAccount` contract, the receiver is the party provided in the `owner` field of the `Asset` record passed to `requestedAsset` argument of `Create_Trade` choice and `offeredAssetCid` is the contract ID of the asset Alice wants to trade:

        create Trade with
          proposer = owner
          receiver = requestedAsset.owner
          ..

Note the types of `offeredAssetCid` and `requestedAssetsTxPreApprovalCid` fields in the Trade template. Conceptually these two fields represent respectively the asset that Alice wants to trade and the asset that Alice wants to receive from Bob in return. Then why do we use `AssetInSwap` and `TransferPreApproval` templates here instead of `Asset` template? Let’s start with `AssetInSwap`. This template represents the asset reserved for the proposed trade. When Alice proposes a trade, her account balance is reduced by the amount of the asset Alice wants to trade, and an `AssetInSwap` contract is created to hold the asset that Alice offers to Bob. This ensures that the trade proposal is funded and that the asset that Alice offers to Bob cannot be used for other purposes while Bob considers the proposal.

    template AssetInSwap
    with
        -- The asset to be swapped.
        asset : Asset
        -- The receiver of the swap proposal.
        receiver : Party
    where
        signatory (signatory asset)
        observer receiver

Note that the signatories on an `AssetInSwap` contract are the same as on the `Asset` contract, which ensures that this contract cannot be created by any one party using the `create` command. 
Now what is the purpose of the `TransferPreApproval` template used in the last field of the `Trade` template? In the settlement of a swap the ownership of Alice’s asset needs to be transferred to Bob and the ownership of Bob’s asset needs to be transferred to Alice. `TransferPreApproval` template is a role contract providing the transfer originator the authority to change the asset owner from the transfer originator party to the transfer recipient party. Bob cannot make Alice the owner of the asset he’s transferring to her without Alice’s authority. `TransferPreApproval` contract allows Alice to pre-authorize a transfer of Bob’s asset to Alice’s account. Before proposing a trade to Bob Alice needs to create a `TransferPreApproval` contract for the asset she wants to receive from Bob by calling `Preapprove_Transfer_In` choice on Alice’s `AssetHoldingAccount` contract for Bob’s asset, and pass the created `TransferPreApproval` contract to the `requestedAssetsTxPreApprovalCid` field of the `Trade` contract. This means the atomic swap workflow requires that Alice has the `AssetHoldingAccount` contract for the asset type that Alice wants to receive from Bob. In fact the atomic swap workflow requires four `AssetHoldingAccount` contracts representing two of Alice’s accounts: one for the asset that Alice wants to trade and one for the asset Alice wants to receive, and two of Bob’s accounts for the same assets.
Similarly to how Alice needs to pre-authorize Bob’s asset transfer, Bob needs to create a `TransferPreApproval` contract for Alice’s asset, which pre-authorizes the transfer of Alice’s asset to Bob’s account. As part of the atomic swap workflow Bob needs to exercise `Preapprove_Transfer_In` choice on Bob’s `AssetHoldingAccount` contract for the asset type that Alice wants to trade. This is implemented inside the `Trade_Settle` choice of the `Trade` template, which Bob executes to accept the trade proposal. After pre-approving the transfer of Alice’s asset to Bob’s account, Bob prepares the asset that he needs to transfer to Alice. Most likely Bob does not have ready available the `Asset` contract with the exact amount that Alice wants. To create this `Asset` contract Bob exercises `Merge_Split` choice on Bob's `AssetHoldingAccount` for the asset that Alice requested from Bob.
Finally `TransferPreApproval_TransferAssetInSwap` choice is called on Bob’s `TransferPreApproval` contract, which archives Alice’s `AssetInSwap` and creates the `Asset` with Bob as owner. And the `TransferPreApproval_TransferAsset` choice is called on Alice’s `TransferPreApproval` contract, which archives Bob’s `Asset` prepared for Alice and creates identical `Asset` contract with Alice as owner.

    choice Trade_Settle : (ContractId Asset, ContractId Asset)
      with
        requestedAssetCids: [ContractId Asset]

      controller receiver
      do
        -- Receiver pre-approves the transfer of asset offered by proposer from proposer to receiver
        offeredAsset <- fetch offeredAssetCid
        (receiverReceivingAssetHoldingAccountCid, _) <- fetchByKey @AssetHoldingAccount (offeredAsset.asset.assetType, receiver)
        offeredAssetTxPreApprovalCid <- exercise receiverReceivingAssetHoldingAccountCid Preapprove_Transfer_In with
            asset = offeredAsset.asset
        -- Receiver prepares the asset requested by the proposer
        requestedAsset <- fetch requestedAssetTxPreApprovalCid
        assertMsg "Non fungible assets must be traded one at a time" $
          requestedAsset.asset.assetType.fungible || L.length requestedAssetCids==1
        (receiverSendingAssetHoldingAccountCid, _) <- fetchByKey @AssetHoldingAccount (requestedAsset.asset.assetType, receiver)
        totRequestedAssetAmount <- validateTxInputs requestedAssetCids receiverSendingAssetHoldingAccountCid requestedAsset.asset.amount
        preparedRequestedAssetCids <- exercise receiverSendingAssetHoldingAccountCid Merge_Split with
          assetCids = requestedAssetCids
          outputAmounts = [requestedAsset.asset.amount]
        -- Transfer offered asset from proposer to receiver
        newReceiverAsset <- exercise offeredAssetTxPreApprovalCid TransferPreApproval_TransferAssetInSwap 
          with assetInSwapCid = offeredAssetCid
        -- Transfer requested asset from receiver to proposer
        newProposerAsset <- exercise requestedAssetTxPreApprovalCid TransferPreApproval_TransferAsset 
          with txAssetCid = last preparedRequestedAssetCids
        return (newProposerAsset, newReceiverAsset)

If we give the asset Alice wants to swap the moniker ALC and the asset she wants to receive from Bob the moniker BOB, the full workflow can be summarized as follows:
1. Alice calls `Create_Trade` choice on Alice’s `AssetHoldingAccount` contract for ALC. This creates an `AssetInSwap` contract for ALC, a `TransferPreApproval` contract for BOB and a `Trade` contract with these `AssetInSwap` and `TransferPreApproval` contracts.
2. To accept the trade proposal Bob needs to gather `Asset` contracts for BOB so that the total amount of these contracts covers the amount of BOBs Alice wants to receive. 
3. With `Asset` contracts from step 2 Bob calls `Trade_Settle` choice on the `Trade` contract. Inside the `Trade_Settle` choice
  - Bob pre-approves the transfer of ALC from Alice by calling `Preapprove_Transfer_In` choice on Bob’s account for ALC. 
  - Bob calls `Merge_Split` choice on Bob’s `AssetHoldingAccount` contract for BOB to create `Asset` contract for BOB in the exact amount requested by Alice in `TransferPreApproval` contract in `requestedAssetsTxPreApprovalCid` field of the `Trade` template.
  - ALCs are transferred to Bob by exercising `TransferPreApproval_TransferAssetInSwap` choice on Bob’s `TransferPreApproval` contract.
  - BOBs are transferred to Alice by exercising `TransferPreApproval_TransferAsset` choice on Alice’s `TransferPreApproval` contract.
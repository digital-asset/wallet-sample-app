# What is UTXO and why we use it in the Wallet Daml Reference App

UTXO stands for “Unspent Transaction Output”. It is the accounting model in most public blockchain networks including Bitcoin, with Etherium being a notable exception.
To learn the difference between UTXO and Account/Balance model, see the following article on Medium
https://medium.com/@sunflora98/utxo-vs-account-balance-model-5e6470f4e0cf

The Account/Balance model is very familiar and intuitive, as this is the same record keeping model utilized by traditional finance institutions. Your bank keeps a record of your account balance and a list of credit/debit transactions on your account that respectively increase/decrease the account balance. UTXO model is unfamiliar and foreign to most people outside of the crypto world. The illustration of this model commonly involves a physical wallet used to store physical banknotes and coins, which is ironic, since the model is applied exclusively to digital coins or tokens. See the above mentioned article for an example of such illustration.
So, why do we use UTXO in the Wallet Daml Reference App then? The main reason is privacy. In particular, when assets are being transferred between two parties, we want to avoid the account balance of the recipient becoming visible to the sender. To understand this, let’s imagine what the implementation of an Account/Balance model would look like in Daml. 
One way to implement it is to store the account balance as a field in an `AssetHoldingAccount` template.

    template AssetHoldingAccount
    with
        assetType : AssetType
        balance : Decimal
        owner : Party
    where
        signatory assetType.issuer, owner
        key (assetType, owner) : (AssetType, Party)
        maintainer key._1.issuer

        choice Create_Transfer : ContractId AssetTransfer
        with
            amount : Decimal
            recipient : Party
        controller owner 
        do
            assertMsg "Not enough funds in the account" (amount<=balance)
            create this with balance = balance - amount 
            create AssetTransfer with
            assetType
            originator = owner
            recipient
            amount

A transfer from one party’s account to another party’s account using the [Propose/Accept pattern](https://docs.daml.com/daml/patterns/initaccept.html) requires another template. Let’s name it `AssetTransfer`. The originator of the transfer must be a signatory on the `AssetTransfer` contract. Otherwise a transfer could be created without the originator’s authority.

    template AssetTransfer
    with
        assetType : AssetType
        amount : Decimal
        originator : Party
        recipient : Party
    where
        signatory assetType.issuer, originator
        observer recipient

        choice Accept_Transfer : ()
        controller recipient
        do
            (accountCid, account) <- fetchByKey @AssetHoldingAccount (assetType, recipient) 
            archive accountCid
            create account with
            balance = account.balance + amount
            return ()

Acceptance of the transfer by the recipient needs to update the balance of the recipient’s account, which involves archiving the recipient’s `AssetHoldingAccount` contracts and recreating it with the new balance. Since the new `AssetHoldingAccount` contract is created by exercising a choice on a template, where the transfer originator is a signatory, the resulting `AssetHoldingAccount` contract and all the data it contains, including the account balance, becomes visible to the transfer originator party through [divulgence](https://docs.daml.com/concepts/ledger-model/ledger-privacy.html#divulgence-when-non-stakeholders-see-contracts). For most use cases this behavior is undesirable. For example, you don’t want your bank account balance to be revealed to everyone who transfers you money. With the Account/Balance model in Daml there’s no way to implement a smooth workflow without divulging transfer recipient’s account balance information to transfer originator.
Given that UTXO is a foreign concept for people outside of the crypto world, it’s very tempting to try to find a way to implement the Account/Balance model without divulging the recipient’s account balance to the transfer originator. Let’s consider an alternative implementation of the Account/Balance model in Daml. Let’s store account balance information in a separate from `AssetHoldingAccount` template named `Asset`. For this template to represent the balance in `AssetHoldingAccount`, the `Asset` and `AssetHoldingAccount` templates must be linked by common key.

    template Asset
    with
        asset_type : AssetType
        owner : Party
        amount : Decimal
    where
        signatory asset_type.issuer, owner
        key (assetType, owner) : (AssetType, Party)
        maintainer key._2

The key ensures that no more than one active `Asset` contract corresponding to an active `AssetHoldingAccount` may exist. It also allows, if one has an `AssetHoldingAccount` contract, to fetch the corresponding `Asset` contract by key. In this implementation, to create a transfer, rather than consuming and recreating the `AssetHoldingAccount` contract, we would consume and recreate the Asset contract. The `Create_Transfer` choice on the `AssetHoldingAccount` template will look like:

    nonconsuming choice Create_Transfer : ContractId AssetTransfer
      with
        amount : Decimal
        recipient : Party
      controller owner 
      do
        assetCid <- lookupByKey @Asset (asset_type, owner)
        assertMsg "Not enough funds in the account" (isSome assetCid)
        asset <- fetch (fromSome assetCid)
        assertMsg "Not enough funds in the account" (amount<=asset.amount) 
        archive (fromSome assetCid)
        create asset with amount = asset.amount - amount
        create AssetTransfer with
          asset
          recipient
          Amount

And the `Accept_Transfer` choice on the `AssetTransfer` template would look like:

    template AssetTransfer
    with
        asset : Asset
        recipient : Party
        amount : Decimal
    where
        signatory (signatory asset)
        observer (observer asset), recipient

        choice Accept_Transfer : ContractId Asset
        controller recipient
        do
            assetCid <- lookupByKey @Asset (asset.asset_type, recipient)
            case assetCid of
            None -> create asset with 
                owner = recipient
            Some assetCid -> do
                asset <- fetch assetCid
                archive assetCid
                create asset with amount = asset.amount + amount

The acceptance of the transfer archives the existing `Asset` contract (if such contract did exist prior to the acceptance of the transfer) and recreates it with the updated amount. Just like in the previous implementation, the resulting `Asset` contract is divulged to the transfer originator party revealing to the transfer originator the recipient’s account balance. 
We could come up with more intermediary steps, e.g. the creation of the resulting `Asset` contract could be implemented in a choice on the `AssetHoldingAccount` template (let’s name this choice `Credit_Transfer`). Instead of creating an `Asset` contract, `Accept_Transfer` choice could fetch by key the recipient’s `AssetHoldingAccount` contract and call `Credit_Transfer` choice on `AssetHoldingAccount`. But none of it would hide the resulting `Asset` contracts from the transfer originator party. As long as the acceptance of the transfer is implemented in one transaction, there’s no way to not divulge the recipient’s account balance to the transfer originator.

With UTXO an asset created in an account is not unique. The account balance is the sum of the amounts of all `Asset` contracts corresponding to `AssetHoldingAccount` by way of having the same `assetType` and `owner`. With this model the acceptance of the transfer can be implemented as the creation of a new `Asset` contract with the amount of the transfer. This `Asset` contract would be divulged to the transfer originator, but the data in this `Asset` contract only provides the amount of the transfer, which the transfer originator knows in any case. The account balance of the recipient is not revealed to the originator because any `Asset` contracts previously held in the recipient’s account do not become visible to the transfer originator party.

Another reason to utilize UTXO in preference over the Account/Balance model, is that with the Account/Balance model the account would be locked during processing of a transfer. Imagine that the account balance is 10 and we want to do 2 transfers in the amounts of 3 and 5. With the Account/Balance model these transfers must be processed sequentially. The second transfer cannot be made until the first transfer is processed. In use cases, where high throughput is required, this creates a bottleneck. With UTXO, if there are 2 `Asset` contracts in an account, the transfer of these two assets can be processed in parallel.
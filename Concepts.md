# Wallet Daml Reference App - concepts and their implementation

In the Wallet Daml Reference App we use the concepts of asset and account. An asset represents a digital token issued by the `issuer` party and `owned` by the owner party. This token may refer to any real life physical, financial or digital assets. The process of representing real world assets through digital tokens is known as [tokenization of assets](https://www.bnymellon.com/us/en/insights/all-insights/tokenization-opening-illiquid-assets-to-investors.html). 

The asset implemented in the Wallet Daml Reference App is a dummy token used purely for illustration purposes. It could be easily replaced by smart contracts implementing digital representation of real world assets or liabilities. One thing the Wallet Daml Reference App aims to demonstrate is the composability and upgrade mechanism of Daml applications. E.g. the Asset.daml module in the app, which implements a dummy token, could be replaced with another module that implements digital representation of a real world asset like an equity, a bond, a real estate property or a work of art without necessarily requiring any changes to other modules.
## Purpose of AssetHoldingAccount
An `AssetHoldingAccount` is an account, where assets can be held and through which assets can be transferred to other users. A wallet can have multiple AssetHoldingAccounts, one for each asset type. Conceptually it is similar to a bank account or a brokerage account you may have with a stock broker.

The `AssetHoldingAccount` template is a [role contract](https://docs.daml.com/daml/intro/6_Parties.html#use-role-contracts-for-ongoing-authorization). It delegates account owner’s authority to the issuer to exercise the `Airdrop` choice, which allows the issuer to mint an asset straight into the owner’s account. Since `issuer` and `owner` are both signatories on the `Asset` template, both issuer’s and owner’s authority is required to create an `Asset` contract. The `Airdrop` choice on the `AssetHoldingAccount` template provides the owner’s authority to the issuer to create an `Asset` contract without a [propose/accept workflow](https://docs.daml.com/daml/patterns/initaccept.html). Similarly the `AssetHoldingAccount` template delegates an issuer’s authority to merge or split assets to the owner through the `Merge_Split` choice on the `AssetHoldingAccount` template. Without a role contract it wouldn’t be possible to implement workflows that require delegation of authority such as airdrop or atomic swap.

## AssetType
An asset in the Wallet Daml Reference App is characterized by asset type, which is a [Daml record](https://docs.daml.com/daml/intro/3_Data.html#records) comprised of the following fields:

    data AssetType = AssetType with
        issuer: Party
        symbol: Text
        fungible : Bool
        reference : Optional Text 
    deriving (Eq, Show)

## Issuer
The `issuer` is a party that issues (mints / creates) the asset. In the Wallet Daml Reference App. Any user can act as an issuer of a new asset and as an owner of assets issued by other users. Although the same user can act in both capacities, the roles of an asset issuer and owner are distinct. In real world production applications issuers and owners will typically be represented by different parties.
The `symbol` is just a textual ID of an asset assigned by the issuer when the issuer first creates his or her own account to hold a new asset type. It’s conceptually analogous to [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) codes identifying fiat currencies (like USD, EUR, CHF etc.) or to stock tickers identifying stocks of listed companies, or to [CUSIPs](https://en.wikipedia.org/wiki/CUSIP) or [ISINs](https://en.wikipedia.org/wiki/International_Securities_Identification_Number) used to identify financial instruments like stocks and bonds. The model implemented in the Wallet Daml Reference App does not enforce the uniqueness of a symbol. The responsibility for ensuring the uniqueness of a symbol is left to the issuer.
## Fungible / Non-Fungible
The `fungible` boolean field specifies whether the asset can be freely split and merged with other assets of the same type. A non fungible asset in this model can only be issued in the amount of 1. Each contract is unique. It cannot be split or merged with other assets of the same type, as opposed to a fungible asset type where we can merge the balance of separate contracts into one. 

The `Asset` template contains an `ensure` clause that enforces the constraint that non fungible assets must have the amount of 1 and that the amount of a fungible asset must be positive.
    ensure (if assetType.fungible then amount>0.0 else (amount==1.0))

## Reference
Finally, the `reference` field provides an optional text that could be used for example to uniquely identify an NFT by URL or by other means. 

## How Assets are Linked with AssetHoldingAccounts
Both `Asset` and `AssetHoldingAccount` templates have `assetType` and `owner` fields. These two fields are the link between `Asset` and `AssetHoldingAccount` contracts. An account holds the assets that have the same `assetType` and `owner` as the account. The balance of the account is the sum of the amounts of all active `Asset` contracts on the ledger, that have the same values for `assetType` and `owner` fields as the `AssetHoldingAccount` contract.
The `AssetHoldingAccount` template has a [contract key](https://docs.daml.com/daml/intro/3_Data.html#contract-keys), which is a tuple of `assetType` and `owner` fields:
    key (assetType, owner) : (AssetType, Party)
    maintainer key._1.issuer
The key allows us to get the account where an asset is held by extracting `assetType` and `owner` fields from the `Asset` contract and using them as the key to fetch the `AssetHoldingAccount` contract. The key also ensures that an owner can have only one account for a given `assetType`.
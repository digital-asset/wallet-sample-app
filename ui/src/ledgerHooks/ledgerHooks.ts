import { Choice, ContractId } from '@daml/types';
import { ActionType } from '../pages/PendingAssetInviteDetailsPage';
import { makeDamlSet } from '../utils/common';
import {Account} from '@daml.js/account'
import {Asset} from '@daml.js/asset';
import { userContext } from '../App';
import { Archive } from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662/lib/DA/Internal/Template';

const {AssetHoldingAccount, AssetHoldingAccountProposal, AssetInSwap, Trade, TransferPreApproval, AssetHoldingAccountCloseProposal, AirdropRequest } = Account
const {Transfer}= Asset
export const useGetAllAssetHoldingAccounts = () => {
  const myPartyId = userContext.useParty();
  const res = userContext.useStreamQueries(AssetHoldingAccount, () => [{ owner: myPartyId }]);
  return res
}
export const useGetAllOutTransfer = () => {
  const res = userContext.useStreamQueries(Transfer, () => []);
  return res
}

interface UseGetMyIssuedAssetAccounts {
  symbol: string;
  reference: string | null;
  fungible: boolean;
}
export const useGetMyIssuedAssetAccounts = (args: UseGetMyIssuedAssetAccounts) => {
  const party = userContext.useParty();
  const { fungible, reference, symbol } = args;
  return userContext.useStreamQueries(AssetHoldingAccount, () => [{ assetType: { issuer: party, fungible, reference, symbol } }]);

}
interface UseGetMyOwnedAssetsByAssetType {
  issuer: string;
  owner: string;
  symbol: string;
  reference: string | null;
  isFungible: boolean;
  isShareable?: boolean;
  isAirdroppable?: boolean;
}

export const useGetMyOwnedAssetsByAssetType = (args: UseGetMyOwnedAssetsByAssetType) => {
  const { issuer, symbol, isFungible, owner, reference } = args  
  const res = userContext.useStreamQueries(Asset.Asset, () => [{ owner, assetType: { issuer, symbol, fungible: isFungible, reference } }]);
  return res
}

export const useGetAssetHoldingAccount = ({ isAirdroppable, isShareable, issuer, symbol, isFungible, owner, reference }: UseGetMyOwnedAssetsByAssetType) => {
  const assetHoldingAccount = userContext.useStreamQueries(AssetHoldingAccount, () => [{ airdroppable: isAirdroppable, reshareable: isShareable, owner, assetType: { issuer, symbol, fungible: isFungible, reference } }]);
  return assetHoldingAccount
}

interface useGetAssetTransferByContractIdArgs {
  contractId: ContractId<Asset.AssetTransfer>;
}

export const useGetAssetTransferByContractId = (arg: useGetAssetTransferByContractIdArgs) => {
  const contract = userContext.useFetch(Asset.AssetTransfer, arg.contractId)
  return contract
}

export const useGetAssetContractByContractId = (contractId: ContractId<Asset.Asset>) => {
  const contract = userContext.useFetch(Asset.Asset, contractId)
  return contract
}
export const useGetAssetInSwapContractByContractId = (contractId: ContractId<Account.AssetInSwap>) => {
  const contract = userContext.useFetch(AssetInSwap, contractId)
  return contract
}
export const useGetTradeContractByCid = (tradeContractId: ContractId<Account.Trade>) => {
  const contract = userContext.useFetch(Trade, tradeContractId)
  return contract
}
export const useGetTransferPreapprovalContractByContractId = (contractId: ContractId<Account.TransferPreApproval>) => {
  const contract = userContext.useFetch(TransferPreApproval, contractId)
  return contract
}

export const useGetMyAssetAccountByKey = (assetType: Asset.AssetType, owner?: string) => {
  const myPartyId = userContext.useParty();
  const contract = userContext.useFetchByKey(AssetHoldingAccount, () => ({ _1: assetType, _2: owner || myPartyId }), [owner]);
  return contract
}

export const useGetAssetHoldingInviteByContractId = (arg: ContractId<Account.AssetHoldingAccountProposal>) => {
  const contract = userContext.useFetch(AssetHoldingAccountProposal, arg)
  return contract
}

export const useGetAssetTransfers = (isInbound?: boolean) => {
  const myPartyId = userContext.useParty();
  const res = userContext.useStreamQueries(Asset.AssetTransfer, () => [{ recipient: isInbound ? myPartyId : undefined, asset: {owner: isInbound ? undefined : myPartyId} }]);
  return res
}
export const useGetAssetSwapRequests = (isInbound?: boolean) => {
  const myPartyId = userContext.useParty();
  const trades = userContext.useStreamQueries(Trade, () => [{ receiver: isInbound ? myPartyId : undefined, proposer: isInbound ? undefined : myPartyId }]);
  return trades
}

// Asset Invites
export const useGetAssetInviteRequests = (isInbound?: boolean) => {
  const myPartyId = userContext.useParty();
  const allAssetSendRequests = userContext.useStreamQueries(AssetHoldingAccountProposal, () => [{ recipient: isInbound ? myPartyId : undefined, account: {owner: isInbound? undefined: myPartyId} }]);
  return allAssetSendRequests
}
// Used to get all propsals for an assetType
export const useGetAssetHoldingAccountProposals = (args: Omit<Asset.AssetType, "issuer">, recipient?: string) => {
  const myPartyId = userContext.useParty();

  const { reference, symbol, fungible } = args;
  const AccountInvites = userContext.useStreamQueries(AssetHoldingAccountProposal, () => [{ account: { assetType: { issuer: myPartyId, symbol, reference, fungible }, recipient } }]);
  return AccountInvites
}

export const useGetMyInboundAssetSendRequests = () => {
  const party = userContext.useParty();
  const allAssetSendRequests = userContext.useStreamQueries(Asset.AssetTransfer, () => [{ recipient: party }]);
  return allAssetSendRequests
}

export const useGetAssetAccountInvites = () => {
  const assetHoldingAccount = userContext.useStreamQueries(AssetHoldingAccountCloseProposal);
  return assetHoldingAccount
}

interface SendAsset {
  assetAccountCid: ContractId<Account.AssetHoldingAccount>;
  amount: any;
  recipient: any;
  assetCids: any
}


export const useLedgerHooks = () => {
  const ledger = userContext.useLedger();
  const party = userContext.useParty();

  const sendAsset = async ({ assetAccountCid, amount, recipient, assetCids }: SendAsset) => {
    try {
      // TODO: suggest react/daml documentation improvement.
      // needing to use _1:, _2:, not obvious enough.
      // how to parse error messages? not user friendly
      const result = await ledger.exercise(AssetHoldingAccount.Create_Transfers, assetAccountCid, {
        assetCids, transfers: [{ _1: amount, _2: recipient }]
      });

      return { isOk: true, payload: result }

    } catch (e) {
      return { isOk: false, payload: e }

    }
  }
  interface InviteNewAssetHolder {
    assetType: Asset.AssetType,
    owner: string,
    recipient: string
  }
  interface ExerciseAirdrop {
    assetType: Asset.AssetType,
    amount: string,
    owner: string,
  }

  interface ProposeSwap {
    outAmount: string;
    // Out AssetType, used to grab assetAccountHolding by key
    outSymbol: string;
    outFungible: boolean;
    outReference: string;
    outIssuer: string;
    inOwner: string;
    outAssetCids: ContractId<Asset.Asset>[];
    inAmount: string;
    inIssuer: string;
    inSymbol: string;
    inFungible: boolean;
    inReference: string;
  }
  const proposeSwap = async (args: ProposeSwap) => {
    const { inOwner, outSymbol, outFungible, outIssuer, outReference, outAmount, outAssetCids, inAmount, inIssuer, inSymbol, inFungible, inReference } = args;
    try {

      const result = await ledger.exerciseByKey(AssetHoldingAccount.Create_Trade, { _1: { issuer: outIssuer, symbol: outSymbol, reference: outReference, fungible: outFungible }, _2: party }, {
        // offered Cids
        assetCids: outAssetCids,
        offeredAssetAmount: outAmount,
        requestedAsset: {
          assetType: {
            issuer: inIssuer,
            fungible: inFungible,
            reference: inReference,
            symbol: inSymbol,
          },
          owner: inOwner,
          amount: inAmount,
          observers: makeDamlSet<string>([])


        }

      })

      return { isOk: true, payload: result }

    } catch (e) {
      return { isOk: false, payload: e }

    }
  }
  interface ExerciseMergeSplit {
    outSymbol: string;
    outFungible: boolean;
    outReference: string;
    outIssuer: string;
    assetCids: ContractId<Asset.Asset>[];
    outputAmount: string;
  }
  const exerciseMergeSplit = async (args: ExerciseMergeSplit) => {
    const { assetCids, outputAmount, outSymbol, outFungible, outIssuer, outReference } = args;
    try {
      // TODO: update documentation
      // needing to use _1:, _2:, not obvious enough.
      // how to parse error messages? not user friendly
      const result = await ledger.exerciseByKey(AssetHoldingAccount.Merge_Split, { _1: { issuer: outIssuer, symbol: outSymbol, reference: outReference, fungible: outFungible }, _2: party }, {
        assetCids: assetCids, outputAmounts: [outputAmount],
      })

      return { isOk: true, payload: result }

    } catch (e) {
      return { isOk: false, payload: e }

    }
  }
  interface ExercisePreapprove {
    issuer: string;
    fungible: boolean;
    reference: string | null;
    symbol: string;
    amount: string;
    owner: string;

  }
  const exercisePreApprove = async (args: ExercisePreapprove) => {
    const { issuer, owner, fungible, reference, symbol, amount } = args;
    try {
      // TODO: update documentation
      // needing to use _1:, _2:, not obvious enough.
      // how to parse error messages? not user friendly
      const result = await ledger.exerciseByKey(AssetHoldingAccount.Preapprove_Transfer_In, { _1: { issuer, symbol, reference, fungible }, _2: party }, {
        asset: {
          assetType: {
            issuer,
            symbol,
            fungible,
            reference
          },
          owner,
          amount,
          observers: makeDamlSet<string>([])
        }
      })
      return { isOk: true, payload: result }
    } catch (e) {
      return { isOk: false, payload: e }

    }
  }

  const exerciseAirdrop = async (args: ExerciseAirdrop) => {
    const { assetType, amount, owner } = args;
    const { issuer, symbol, reference, fungible } = assetType;
    try {
      // TODO: update documentation
      // needing to use _1:, _2:, not obvious enough.
      // how to parse error messages? not user friendly
      const result = await ledger.exerciseByKey(AssetHoldingAccount.Airdrop, { _1: { issuer, symbol, reference, fungible }, _2: owner }, { amount })
      // const result = await ledger.exercise(AssetHoldingAccount.Invite_New_Asset_Holder, assetAccountCid, {
      //   recipient
      // });

      return { isOk: true, payload: result }

    } catch (e) {
      return { isOk: false, payload: e }

    }
  }
  const inviteNewAssetHolder = async (args: InviteNewAssetHolder) => {
    const { assetType, owner, recipient } = args;
    const { issuer, symbol, reference, fungible } = assetType;
    try {
      // TODO: update documentation
      // needing to use _1:, _2:, not obvious enough.
      // how to parse error messages? not user friendly
      const result = await ledger.exerciseByKey(AssetHoldingAccount.Invite_New_Asset_Holder, { _1: { issuer, symbol, reference, fungible }, _2: owner }, { recipient })
      // const result = await ledger.exercise(AssetHoldingAccount.Invite_New_Asset_Holder, assetAccountCid, {
      //   recipient
      // });

      return { isOk: true, payload: result }

    } catch (e) {
      return { isOk: false, payload: e }

    }
  }


  const acceptAssetTransfer = async (accountHoldingCid: ContractId<Account.AssetHoldingAccount>, transferCid: ContractId<Asset.AssetTransfer>) => {
    try {
      const result = await ledger.exercise(AssetHoldingAccount.Deposit_Transfer_Into_Account, accountHoldingCid, {
        transferCid
      });

      return { isOk: true, payload: result }

    } catch (e) {
      return { isOk: false, payload: e }

    }
  }

  const exerciseAssetHolderInvite = async (assetHoldingAccountProposalCid: ContractId<Asset.Accept_Transfer | Asset.Cancel_Transfer | Asset.Reject_Transfer>, action: ActionType) => {
    interface Map {
      accept: Choice<Asset.Cancel_Transfer | Asset.Accept_Transfer | Asset.Reject_Transfer, {}, {}, undefined>,
      reject: Choice<Asset.Cancel_Transfer | Asset.Accept_Transfer | Asset.Reject_Transfer, {}, {}, undefined>,
      cancel: Choice<Account.AssetHoldingAccountProposal, {}, {}, undefined> & Choice<Account.AssetHoldingAccountProposal, Archive, {}, undefined>



    }
    const map: Map = {
      accept: AssetHoldingAccountProposal.AssetHoldingAccountProposal_Accept,
      reject: AssetHoldingAccountProposal.AssetHoldingAccountProposal_Reject,
      cancel: AssetHoldingAccountProposal.Archive
    }

    try {
      // TODO: update documentation
      // needing to use _1:, _2:, not obvious enough.
      // how to parse error messages? not user friendly
      // TODO: Fix this type error
      const result = await ledger.exercise(map[action], assetHoldingAccountProposalCid, {
      });

      return { isOk: true, payload: result }

    } catch (e) {
      return { isOk: false, payload: e }

    }
  }
  interface AssetTransferChoies {
    cancel: Choice<Asset.AssetTransfer, Asset.Cancel_Transfer, ContractId<Asset.Asset>, undefined>,
    reject: Choice<Asset.AssetTransfer, Asset.Reject_Transfer, ContractId<Asset.Asset>, undefined>
  }

  const assetTransferChoices: AssetTransferChoies = {
    cancel: Asset.AssetTransfer.Cancel_Transfer,
    reject: Asset.AssetTransfer.Reject_Transfer
  }

  const exerciseAssetTransferChoice = async (assetTransferCid: ContractId<Asset.AssetTransfer>, action: 'cancel' | 'reject') => {
    try {
      const result = await ledger.exercise(assetTransferChoices[action], assetTransferCid, {
      });

      return { isOk: true, payload: result }

    } catch (e) {
      return { isOk: false, payload: e }

    }
  }


  const exerciseTradeSettle = async (tradeCid: ContractId<Account.Trade>, requestedAssetCids: ContractId<Asset.Asset>[]) => {
    try {
      const result = await ledger.exercise(Trade.Trade_Settle, tradeCid, {
        requestedAssetCids
      });

      return { isOk: true, payload: result }

    } catch (e) {
      return { isOk: false, payload: e }

    }
  }
  const exerciseTradeCancel = async (tradeCid: ContractId<Account.Trade>) => {
    try {
      const result = await ledger.exercise(Trade.Trade_Cancel, tradeCid, {
      });

      return { isOk: true, payload: result }

    } catch (e) {
      return { isOk: false, payload: e }
    }
  }
  const exerciseTradeReject = async (tradeCid: ContractId<Account.Trade>) => {
    try {
      const result = await ledger.exercise(Trade.Trade_Reject, tradeCid, {
      });

      return { isOk: true, payload: result }

    } catch (e) {
      return { isOk: false, payload: e }
    }
  }

  const cancelAssetTransfer = async (assetTransferCid: ContractId<Asset.AssetTransfer>) => {
    try {
      const result = await ledger.exercise(Asset.AssetTransfer.Cancel_Transfer, assetTransferCid, {
      });

      return { isOk: true, payload: result }

    } catch (e) {
      return { isOk: false, payload: e }

    }
  }

  const issueAsset = async ({ amount, symbol, isFungible, reference }: {reference: string | null, amount: string, symbol: string, isFungible: boolean }) => {
    try {
      const asset = await ledger.create(Asset.Asset, {
        assetType: { issuer: party, symbol: symbol, fungible: isFungible, reference },
        owner: party,
        amount,
        observers: makeDamlSet<string>([party])
      })
      return { isOk: true, payload: asset }
    } catch (e) {
      return { isOk: false, payload: e }
    }
  }

  const createAirdropRequest = async ({ amount, requester, assetHoldingAccountIssuer, assetHoldingAccountCid }: {requester: string, amount: string, assetHoldingAccountIssuer: string, assetHoldingAccountCid: ContractId<Account.AssetHoldingAccount> }) => {
    try {
      const asset = await ledger.create(AirdropRequest, {
        requester: party,
        amount,
        assetHoldingAccountIssuer, 
        assetHoldingAccountCid
      })
      return { isOk: true, payload: asset }
    } catch (e) {
      return { isOk: false, payload: e }
    }
  }


  const createAssetAccount = async ({ symbol, isAirdroppable, isFungible, isShareable, reference }: { symbol: string, isFungible: boolean; reference: string | null, isAirdroppable: boolean, isShareable: boolean }) => {
    try {
      const assetAccount = await ledger.create(AssetHoldingAccount, {
        assetType: { issuer: party, symbol: symbol, fungible: isFungible, reference },
        owner: party,
        airdroppable: isAirdroppable,
        resharable: isShareable
      })
      return { isOk: true, payload: assetAccount }
    } catch (e) {
      return { isOk: false, payload: e }
    }
  }

  return {createAirdropRequest, exercisePreApprove, exerciseTradeReject, exerciseTradeCancel, exerciseTradeSettle, exerciseMergeSplit, proposeSwap, exerciseAirdrop, exerciseAssetTransferChoice, exerciseAssetHolderInvite, inviteNewAssetHolder, acceptAssetTransfer, cancelAssetTransfer, sendAsset, createAssetAccount, issueAsset }

}
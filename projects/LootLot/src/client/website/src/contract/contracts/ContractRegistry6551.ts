import { ContractBase } from "./ContractBase";
import ContractERC6551RegistryAI from "../abi/contracts/systems/ERC6551/ERC6551Registry.sol/ERC6551Registry.json";
import { contractData } from "../../data/ContractData";
import { walletData } from "@/data/WalletData";
import { IndexDB } from "@/plugins/indexDB";

export class ContractERC6551Registry extends ContractBase {
  static create(): any {
    const address = contractData.contractAddress.Registry6551;
    const contract = new ContractERC6551Registry(
      ContractERC6551RegistryAI,
      address,
      "",
      ""
    );
    return contract.createContract();
  }

  async account(tokenId: number, nftContractAddress: string) {
    const cacheKey = `6551_account_${tokenId}_${nftContractAddress}_${walletData.chainId}`;
    const cache = await IndexDB.instance.getItem(cacheKey);
    if (cache) {
      return cache;
    }

    const account = await this.contract.account(
      contractData.contractAddress.Account6551,
      walletData.chainId,
      nftContractAddress,
      tokenId,
      tokenId,
      []
    );

    await IndexDB.instance.addItem(cacheKey, account);

    return account;
  }

  public registerEvents() {
    // TODO
  }
}

import { ContractBase } from "./ContractBase";
import ContractLLTTokenABI from "../abi/contracts/tokens/LLTToken.sol/LLTToken.json";
import { contractData } from "../../data/ContractData";
import { ethers } from "ethers";
import { playerData } from "../../data/PlayerData";

export class ContractLLTToken extends ContractBase {
  static create(): any {
    const address = contractData.contractAddress.LLTToken;
    const contract = new ContractLLTToken(ContractLLTTokenABI, address, "", "");
    return contract.createContract();
  }

  async balanceOf(address: string): Promise<string> {
    return await this.contract.balanceOf(address);
  }

  async balanceOf6551(address: string) {
    const player = await playerData.getPlayerData(address);
    if (!player) {
      return "0";
    }
  }

  public registerEvents() {
    // TODO
  }
}

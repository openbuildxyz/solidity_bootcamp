import { ContractBase } from "./ContractBase";
import ContractCarStoreABI from "../abi/contracts/systems/core/CarStore.sol/CarStore.json";
import { contractData } from "../../data/ContractData";
import { EventBus } from "../../plugins/EventBus";
import { GameEventBuyCar } from "../../events/GameEventBuyCar";
import { BigNumber, ethers } from "ethers";

export class ContractCarStore extends ContractBase {
  static create(): any {
    const address = contractData.contractAddress.CarStore;
    const contract = new ContractCarStore(ContractCarStoreABI, address, "", "");
    return contract.createContract();
  }

  async buyCar() {
    await this.contract.mint();
  }

  public registerEvents() {
    this.contract.on(
      "CarMint",
      (to: string, tokenId: BigNumber, account: string) => {
        EventBus.instance.emit(
          GameEventBuyCar.event,
          ethers.utils.getAddress(to),
          tokenId.toNumber()
        );
      }
    );
  }
}

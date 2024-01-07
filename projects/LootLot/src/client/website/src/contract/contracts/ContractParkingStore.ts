import { ContractBase } from "./ContractBase";
import ContractParkingStoreABI from "../abi/contracts/systems/core/ParkingStore.sol/ParkingStore.json";
import { contractData } from "../../data/ContractData";
import { EventBus } from "../../plugins/EventBus";
import { GameEventBuyParkings } from "../../events/GameEventBuyParkings";
import { ethers } from "ethers";

export class ContractParkingStore extends ContractBase {
  static create(): any {
    const address = contractData.contractAddress.ParkingStore;
    const contract = new ContractParkingStore(
      ContractParkingStoreABI,
      address,
      "",
      ""
    );
    return contract.createContract();
  }

  public async buyParkings() {
    await this.contract.mintMax();
  }

  public registerEvents() {
    this.contract.on("ParkingMintMax", (to: string, tokenIds: number[]) => {
      const tokens: number[] = [];
      tokenIds.forEach((id: any) => {
        tokens.push(parseInt(`${id.toNumber()}`));
      });
      EventBus.instance.emit(
        GameEventBuyParkings.event,
        ethers.utils.getAddress(to),
        tokens
      );
    });
  }
}

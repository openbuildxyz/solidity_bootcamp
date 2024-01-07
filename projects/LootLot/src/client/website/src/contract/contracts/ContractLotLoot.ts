import { ContractBase } from "./ContractBase";
import ContractLotLootABI from "../abi/contracts/systems/core/LotLoot.sol/LotLoot.json";
import { contractData } from "../../data/ContractData";
import { EventBus } from "../../plugins/EventBus";
import { GameEventParkCar } from "../../events/GameEventParkCar";
import { BigNumber, ethers } from "ethers";
import { GameEventUnParkCar } from "../../events/GameEventUnParkCar";
import { GameEventFineCar } from "../../events/GameEventFineCar";

export class ContractLotLoot extends ContractBase {
  static create(): any {
    const address = contractData.contractAddress.LotLoot;
    const contract = new ContractLotLoot(ContractLotLootABI, address, "", "");
    return contract.createContract();
  }

  async park(carTokenId: number, parkingTokenId: number) {
    await this.contract.parkCar(carTokenId, parkingTokenId);
  }

  async unPark(carTokenId: number) {
    await this.contract.unParkCar(carTokenId);
  }

  async fineCar(parkingTokenId: number) {
    await this.contract.fineCar(parkingTokenId);
  }

  async getCarParking(carTokenId: number): Promise<number> {
    const parkingTokenId = await this.contract.viewCarOnPark(carTokenId);
    return parkingTokenId.toNumber();
  }

  async getParkingCar(parkingTokenId: number): Promise<number> {
    const carTokenId = await this.contract.viewParkOnCar(parkingTokenId);
    return carTokenId.toNumber();
  }

  public registerEvents() {
    this.contract.on(
      "ParkCar",
      (who: string, carTokenId: BigNumber, parkingTokenId: BigNumber) => {
        EventBus.instance.emit(
          GameEventParkCar.event,
          ethers.utils.getAddress(who),
          carTokenId.toNumber(),
          parkingTokenId.toNumber()
        );
      }
    );

    this.contract.on(
      "UnParkCar",
      (who: string, carTokenId: BigNumber, parkingTokenId: BigNumber) => {
        EventBus.instance.emit(
          GameEventUnParkCar.event,
          ethers.utils.getAddress(who),
          carTokenId.toNumber(),
          parkingTokenId.toNumber()
        );
      }
    );

    this.contract.on(
      "FineCar",
      (who: string, carTokenId: BigNumber, parkingTokenId: BigNumber) => {
        EventBus.instance.emit(
          GameEventFineCar.event,
          ethers.utils.getAddress(who),
          carTokenId.toNumber(),
          parkingTokenId.toNumber()
        );
      }
    );
  }
}

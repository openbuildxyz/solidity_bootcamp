import { StringUtil } from "../../core/utils/StringUtil";
import { ParkingStatus } from "../../const/enum/ParkingStatus";
import { contractData } from "../ContractData";
import { BaseDTO } from "./BaseDTO";
import { walletData } from "../WalletData";
import { ethers } from "ethers";

export class ParkingDTO extends BaseDTO {
  tokenId: number = 0;
  carTokenId: number = 0;

  owner: string = "";
  carOwner: string = "";

  account: string = "";

  public get isMyParking(): boolean {
    return this.owner === walletData.address;
  }

  public get status(): ParkingStatus {
    if (!this.isParked) {
      return ParkingStatus.EMPTY;
    } else if (this.isMyParking) {
      return ParkingStatus.PARKED_BY_FRIEND;
    } else {
      if (this.carOwner !== walletData.address) {
        return ParkingStatus.PARKED_BY_FRIEND;
      } else {
        return ParkingStatus.PARKED_BY_ME;
      }
    }
  }

  public get isParked(): boolean {
    return this.carTokenId > 0;
  }

  public async getBalance() {
    if (StringUtil.isEmpty(this.account)) {
      return ethers.constants.Zero;
    }

    const balance = await contractData.lltTokenContract.balanceOf(this.account);
    return balance;
  }

  public static async create(tokenId: number, carTokenId = 0) {
    const parkingDTO = this.fillWith({
      tokenId: tokenId,
      carTokenId: carTokenId,
    });

    if (!carTokenId) {
      const car = await contractData.lotLootContract.getParkingCar(tokenId);
      parkingDTO.carTokenId = car;
    }

    const owner = await contractData.parkingERC721Contract.ownerOf(tokenId);
    parkingDTO.owner = ethers.utils.getAddress(owner);
    if (parkingDTO.carTokenId > 0) {
      const carOwner = await contractData.carERC721Contract.ownerOf(
        parkingDTO.carTokenId
      );
      parkingDTO.carOwner = ethers.utils.getAddress(carOwner);
    }

    parkingDTO.account = await contractData.registry6551Contract.account(
      tokenId,
      contractData.contractAddress.ParkingERC721
    );

    return parkingDTO;
  }
}

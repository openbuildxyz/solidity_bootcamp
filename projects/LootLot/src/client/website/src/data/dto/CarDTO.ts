import { ethers } from "ethers";
import { contractData } from "../ContractData";
import { BaseDTO } from "./BaseDTO";
import { CarStatus } from "../../const/enum/CarStatus";
import { StringUtil } from "../../core/utils/StringUtil";

export class CarDTO extends BaseDTO {
  tokenId: number = 0;
  parkingTokenId: number = 0;

  owner: string = "";
  parkingOwner: string = "";

  account: string = "";

  public get isParking(): boolean {
    return this.parkingTokenId > 0;
  }

  public get isEmpty(): boolean {
    return this.status === CarStatus.EMPTY;
  }

  public get status(): CarStatus {
    if (this.isParking) {
      return CarStatus.PARKED;
    }
    return CarStatus.EMPTY;
  }

  public async getBalance() {
    if (StringUtil.isEmpty(this.account)) {
      return ethers.constants.Zero;
    }

    const balance = await contractData.lltTokenContract.balanceOf(this.account);
    return balance;
  }

  public static async create(tokenId: number, parkingTokenId = 0) {
    const carDTO = this.fillWith({
      tokenId: tokenId,
      parkingTokenId: parkingTokenId,
    });

    if (!parkingTokenId) {
      const parking = await contractData.lotLootContract.getCarParking(tokenId);
      carDTO.parkingTokenId = parking;
    }

    const owner = await contractData.carERC721Contract.ownerOf(tokenId);
    carDTO.owner = ethers.utils.getAddress(owner);
    if (carDTO.parkingTokenId > 0) {
      const parkingOwner = await contractData.parkingERC721Contract.ownerOf(
        carDTO.parkingTokenId
      );
      carDTO.parkingOwner = ethers.utils.getAddress(parkingOwner);
    }

    carDTO.account = await contractData.registry6551Contract.account(
      tokenId,
      contractData.contractAddress.CarERC721
    );

    return carDTO;
  }
}

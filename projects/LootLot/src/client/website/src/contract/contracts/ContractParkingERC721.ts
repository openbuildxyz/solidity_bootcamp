import { ContractBase } from "./ContractBase";
import ContractParkingERC721ABI from "../abi/contracts/tokens/ParkingERC721.sol/ParkingERC721.json";
import { contractData } from "../../data/ContractData";
import { IndexDB } from "../../plugins/indexDB";
import { StringUtil } from "../../core/utils/StringUtil";

export class ContractParkingERC721 extends ContractBase {
  static create(): any {
    const address = contractData.contractAddress.ParkingERC721;
    const contract = new ContractParkingERC721(
      ContractParkingERC721ABI,
      address,
      "",
      ""
    );
    return contract.createContract();
  }

  async getPlayerParkings(address: string): Promise<any[]> {
    const balance = await this.contract.balanceOf(address);
    if (balance && balance.toNumber() < 0) {
      return [];
    }

    const tokenIds = [];
    for (let i = 0; i < balance.toNumber(); i++) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, i);
      tokenIds.push(tokenId.toNumber());
    }
    return tokenIds;
  }

  async ownerOf(tokenId: number) {
    const cacheKey = `nft_parking_owner_${tokenId}`;
    const cache = await IndexDB.instance.getItem(cacheKey);
    if (!cache) {
      const owner = await this.contract.ownerOf(tokenId);
      if (!StringUtil.isEmpty(owner)) {
        await IndexDB.instance.addItem(cacheKey, owner);
      }
      return owner;
    } else {
      return cache;
    }
  }

  public registerEvents() {
    // TODO
  }
}

import {
  CONTRACT_ADDRESS_MUMBAI,
  CONTRACT_ADDRESS_SCROLL,
  IContractAddress,
} from "../const/Contracts";
import { ChainID } from "../const/enum/Chain";
import { Singleton } from "../core/game/Singleton";
import { walletData } from "./WalletData";
import { ContractParkingStore } from "../contract/contracts/ContractParkingStore";
import { ContractCarERC721 } from "../contract/contracts/ContractCarERC721";
import { ContractParkingERC721 } from "../contract/contracts/ContractParkingERC721";
import { ContractCarStore } from "../contract/contracts/ContractCarStore";
import { ContractLotLoot } from "../contract/contracts/ContractLotLoot";
import { ContractLLTToken } from "../contract/contracts/ContractLLTToken";
import { ContractERC6551Registry } from "../contract/contracts/ContractRegistry6551";

export class ContractData extends Singleton {
  private _carStoreContractIns: any = null!;
  private _parkingStoreContractIns: any = null!;
  private _carERC721ContractIns: any = null!;
  private _parkingERC721StoreContractIns: any = null!;
  private _lotLootContractIns: any = null;
  private _lltTokenContractIns: any = null;
  private _6551RegistryContractIns: any = null;

  public get carStoreContract(): any {
    if (!this._carStoreContractIns) {
      this._carStoreContractIns = ContractCarStore.create();
    }
    return this._carStoreContractIns;
  }

  public get parkingStoreContract(): any {
    if (!this._parkingStoreContractIns) {
      this._parkingStoreContractIns = ContractParkingStore.create();
    }
    return this._parkingStoreContractIns;
  }

  public get carERC721Contract(): any {
    if (!this._carERC721ContractIns) {
      this._carERC721ContractIns = ContractCarERC721.create();
    }
    return this._carERC721ContractIns;
  }

  public get parkingERC721Contract(): any {
    if (!this._parkingERC721StoreContractIns) {
      this._parkingERC721StoreContractIns = ContractParkingERC721.create();
    }
    return this._parkingERC721StoreContractIns;
  }

  public get lotLootContract(): any {
    if (!this._lotLootContractIns) {
      this._lotLootContractIns = ContractLotLoot.create();
    }
    return this._lotLootContractIns;
  }

  public get lltTokenContract(): any {
    if (!this._lltTokenContractIns) {
      this._lltTokenContractIns = ContractLLTToken.create();
    }
    return this._lltTokenContractIns;
  }

  public get registry6551Contract(): any {
    if (!this._6551RegistryContractIns) {
      this._6551RegistryContractIns = ContractERC6551Registry.create();
    }
    return this._6551RegistryContractIns;
  }

  public get contractAddress(): IContractAddress {
    if (walletData.chainId === ChainID.Mumbai) {
      return CONTRACT_ADDRESS_MUMBAI;
    } else if (walletData.chainId === ChainID.Scroll) {
      return CONTRACT_ADDRESS_SCROLL;
    }
    return CONTRACT_ADDRESS_MUMBAI;
  }

  public clearAllContracts() {
    this._carStoreContractIns = null;
    this._parkingStoreContractIns = null;
    this._carERC721ContractIns = null;
    this._parkingERC721StoreContractIns = null;
    this._lotLootContractIns = null;
    this._lltTokenContractIns = null;
    this._6551RegistryContractIns = null;
  }

  init() {}
}
export const contractData: Readonly<ContractData> = ContractData.getInstance();

import { ethers } from "ethers";
import { Singleton } from "../core/game/Singleton";
import { ChainID } from "../const/enum/Chain";
import { EventBus } from "../plugins/EventBus";
import { IndexDB } from "../plugins/indexDB";
import { GameEventWalletAccountChanged } from "../events/GameEventWalletAccountChanged";
import { GameEventWalletDisconnect } from "../events/GameEventWalletDisconnect";
import { StringUtil } from "../core/utils/StringUtil";
import { GameEventWalletConnected } from "../events/GameEventWalletConnected";
import { Toast } from "../plugins/Toast";
import { contractData } from "./ContractData";

interface WalletCache {
  address: string;
  chainId: number;
}

const ChainIds = Object.keys(ChainID)
  .filter((key) => !isNaN(Number(ChainID[key as keyof typeof ChainID])))
  .map((key) => ChainID[key as keyof typeof ChainID]);

export class WalletData extends Singleton {
  private _provider: any = null;
  private data: WalletCache = {
    address: "",
    chainId: -1,
  };

  public get cacheKey(): string {
    return "DB:WalletData";
  }

  public get ethereum(): any {
    //@ts-ignore
    return window?.ethereum;
  }

  public get hasProvider(): boolean {
    return this.ethereum !== undefined && this.ethereum !== null;
  }

  public get address(): string {
    if (StringUtil.isEmpty(this.data.address)) {
      return this.data.address;
    }
    return ethers.utils.getAddress(this.data.address);
  }

  public get shortAddress(): string {
    if (StringUtil.isEmpty(this.data.address)) {
      return "";
    }

    const length = this.data.address.length;
    return `${this.data.address.substring(
      0,
      6
    )}...${this.data.address.substring(length - 4, length)}`;
  }

  public get chainId(): number {
    return this.data.chainId;
  }

  public get isCurrentChainValid(): boolean {
    return this.chainId === ChainID.Mumbai || this.chainId === ChainID.Scroll;
  }

  public get provider(): any {
    if (!this._provider && this.hasProvider) {
      this._provider = new ethers.providers.Web3Provider(this.ethereum);
    }
    return this._provider;
  }

  public get isAuth(): boolean {
    return !StringUtil.isEmpty(this.data.address);
  }

  constructor() {
    super();
    this.registerProviderEvent();
  }

  async init() {
    await this.loadData();
  }

  private registerProviderEvent() {
    if (!this.hasProvider) {
      return;
    }
    this.ethereum.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length > 0) {
        this.changeAccount(accounts[0]);
      }
    });
    this.ethereum.on("chainChanged", (chainId: string) =>
      this.chainChange(parseInt(chainId, 16))
    );
    this.ethereum.on("disconnect", () => this.disconnect());
  }

  private async loadData() {
    const data: any = await IndexDB.instance.getItem(this.cacheKey);
    if (data) {
      // TODO
      let chainId = this.ethereum ? 0 : -1;
      if (chainId === 0) {
        const network = await this.provider.getNetwork();
        chainId = network.chainId;
      }

      if (chainId === data.chainId) {
        this.data.address = data?.address ?? "";
        this.data.chainId = data?.chainId ?? -1;
      } else {
        IndexDB.instance.deleteItem(this.cacheKey);
      }
    }
  }

  private async saveData() {
    await IndexDB.instance.addItem(this.cacheKey, {
      address: this.data.address,
      chainId: this.data.chainId,
    });
  }

  public async isChainValid(): Promise<boolean> {
    if (!this.hasProvider) {
      return Promise.resolve(false);
    }
    const currentId = this.data.chainId;
    if (ChainIds.findIndex((id) => id === currentId) >= 0) {
      return Promise.resolve(true);
    }

    const chainId0x = await this.ethereum.request({
      method: "eth_chainId",
    });

    const chainId = parseInt(chainId0x, 16);
    const idx = ChainIds.findIndex((id) => id === chainId);
    return idx >= 0;
  }

  public async switchNetwork(chainId: number = ChainID.Scroll) {
    if (!this.provider) {
      Toast.error("there's no provider.");
      return Promise.resolve();
    }

    try {
      await this.provider.send("wallet_switchEthereumChain", [
        { chainId: `0x${chainId.toString(16)}` },
      ]);
    } catch (e) {
      Toast.error(`change network failed.`);
      console.error("change network", e);
    }
  }

  public async changeAccount(account: string) {
    if (StringUtil.isEmpty(account)) {
      await this.disconnect();
    } else {
      this.data.address = account;
      this.saveData();
      EventBus.instance.emit(GameEventWalletAccountChanged.event, account);
    }
  }

  public async chainChange(chainId: number) {
    this._provider = null;
    contractData.clearAllContracts();
    // TODO
    await this.disconnect();
  }

  public async connectWallet(): Promise<void> {
    if (!this.hasProvider) {
      Toast.error(`there's no provider`);
      return Promise.resolve();
    }
    const chainId0x = await this.ethereum.request({
      method: "eth_chainId",
    });

    const chainId = parseInt(chainId0x, 16);
    const idx = ChainIds.findIndex((id) => id === chainId);
    if (idx < 0) {
      // Toast.error(
      //   `chain ${chainId} is not supported, please switch your network`
      // );
      // return Promise.resolve();
      return await this.switchNetwork();
    }

    const accounts = await this.ethereum.request({
      method: "eth_requestAccounts",
    });
    if (accounts.length <= 0) {
      return Promise.resolve();
    }
    const address = accounts[0];
    this.data.address = address;
    this.data.chainId = chainId;
    this.saveData();

    EventBus.instance.emit(GameEventWalletConnected.event, accounts[0]);
  }

  public async disconnect() {
    this.data.address = "";
    this.data.chainId = -1;
    await IndexDB.instance.deleteItem(this.cacheKey);
    this.saveData();
    EventBus.instance.emit(GameEventWalletDisconnect.event);
  }
}
export const walletData: Readonly<WalletData> = WalletData.getInstance();

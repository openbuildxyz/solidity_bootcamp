import { walletData } from "@/data/WalletData";
import { ethers } from "ethers";

const { ethereum } = window as any;

export abstract class ContractBase {
  public readonly contractABI: any;

  private _contractAddress: string;
  private _contractJsonRpcUrl: string;
  private _contractSignerPrivateKey: string;

  private _contractIns: any;

  protected get contract(): any {
    return this._contractIns;
  }

  public get contractAddress(): string {
    return this._contractAddress;
  }
  public set contractAddress(value: string) {
    this._contractAddress = value;
  }

  public get contractSignerPrivateKey(): string {
    return this._contractSignerPrivateKey;
  }
  public set contractSignerPrivateKey(value: string) {
    this._contractSignerPrivateKey = value;
  }

  public get contractJsonRpcUrl(): string {
    return this._contractJsonRpcUrl;
  }
  public set contractJsonRpcUrl(value: string) {
    this._contractJsonRpcUrl = value;
  }

  constructor(
    contractABI: any,
    contractAddress: string,
    contractSignerPrivateKey: string,
    contractJsonRpcUrl: string
  ) {
    this.contractABI = contractABI;
    this._contractAddress = contractAddress;
    this._contractSignerPrivateKey = contractSignerPrivateKey;
    this._contractJsonRpcUrl = contractJsonRpcUrl;
  }

  public createContract(privateKey?: string, contractAddress?: string): any {
    return this.createContractInstance(privateKey, contractAddress) as any;
  }

  public createProvider(url?: string): any {
    const provider = this.createProviderInstance(url ?? "");
    return provider;
  }

  protected createSigner(HttpProvider: any, signerPrivateKey: string): any {
    const signer = new ethers.Wallet(signerPrivateKey, HttpProvider);
    return signer;
  }

  protected createProviderInstance(network: string): any {
    const provider = new ethers.providers.Web3Provider(ethereum);
    return provider;
  }

  protected createContractInstance(
    privateKey?: string,
    contractAddress?: string
  ): any {
    const contract = new ethers.Contract(
      contractAddress || this.contractAddress,
      this.contractABI
    );

    // const signer = this.createSigner(
    //   this.createProvider(this.contractJsonRpcUrl),
    //   privateKey || this.contractSignerPrivateKey
    // );
    // return contract.connect(signer);

    const signer = walletData.provider.getSigner();

    this._contractIns = contract.connect(signer);

    this.registerEvents();
    return this;
  }

  public registerEvents() {}
}

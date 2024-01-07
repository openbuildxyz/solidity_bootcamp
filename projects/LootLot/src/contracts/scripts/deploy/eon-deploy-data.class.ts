import { HardhatRuntimeEnvironment } from "hardhat/types";

const ignoreNetworks = ["hardhat"];
const manifestVersion = "0.0.1";

export interface ContractDeployData {
  contractName: string;
  address: string | undefined;
}

export class EonDeployData {
  private makeContractDeployData(
    contractName: string,
    address: string | undefined
  ): ContractDeployData {
    return {
      contractName: contractName,
      address: address,
    };
  }
  private getDeployFilePath(chainName: string, chainId: number): string {
    //json file location: {project_root}/.eon/deploy-data-{chainId}.json
    const projectRoot = process.cwd();
    const deployFilePath = `${projectRoot}/.eon/deploy-${chainName}-${chainId}.json`;
    return deployFilePath;
  }

  private loadDeployData(chainName: string, chainId: number): any {
    //load deploy data from json file
    const deployFilePath = this.getDeployFilePath(chainName, chainId);
    const fs = require("fs");
    if (!fs.existsSync(deployFilePath)) {
      return {};
    }
    const deployData = require(deployFilePath);
    return deployData;
  }
  private saveDeployData(chainName: string, chainId: number, deployData: any) {
    if (ignoreNetworks.includes(chainName)) {
      return;
    }
    //save deploy data to json file
    //json file location: {project_root}/.eon/deploy-data-{chainId}.json
    const deployFilePath = this.getDeployFilePath(chainName, chainId);

    const fs = require("fs");
    const path = require("path");
    const dirname = path.dirname(deployFilePath);

    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    //check if file exist
    if (!fs.existsSync(deployFilePath)) {
      //add manifestVersion
      deployData["manifestVersion"] = manifestVersion;
    }

    fs.writeFileSync(deployFilePath, JSON.stringify(deployData, null, 2));
  }

  private async getContractDeployData(
    chainName: string,
    chainId: number,
    contractName: string
  ): Promise<ContractDeployData> {
    //load deploy data from json file
    //json file location: {project_root}/.eon/deploy-data-{chainId}.json
    //load deploy data from json file

    const deployData = this.loadDeployData(chainName, chainId);

    //get deploy data
    const deployDataItem: ContractDeployData = deployData[contractName];
    if (!deployDataItem) {
      const emptyDeployData = {
        contractName: contractName,
        address: undefined,
      } as any;
      return emptyDeployData;
    }

    return deployDataItem;
  }

  private async getChainId(hre: HardhatRuntimeEnvironment): Promise<number> {
    const id =
      hre.network.config.chainId ??
      (await hre.ethers.provider.send("eth_chainId", []).then((id: any) => {
        return parseInt(id, 16);
      }));

    return id as number;
  }

  private async saveContractDeployData(
    chainName: string,
    chainId: number,
    contractName: string,
    address: string,
    contractNameAlias?: string
  ): Promise<void> {
    //load deploy data from json file
    //json file location: {project_root}/.eon/deploy-data-{chainId}.json
    //load deploy data from json file
    const deployData = this.loadDeployData(chainName, chainId);

    let contractNameToSave = contractNameAlias ?? contractName;
    //save deploy data
    deployData[contractNameToSave] = this.makeContractDeployData(
      contractName,
      address
    );

    this.saveDeployData(chainName, chainId, deployData);
  }

  public async getContractDeployDataWithHre(
    hre: HardhatRuntimeEnvironment,
    contractName: string
  ): Promise<ContractDeployData> {
    const id = await this.getChainId(hre);
    return this.getContractDeployData(hre.network.name, id, contractName);
  }

  public async saveContractDeployDataWithHre(
    hre: HardhatRuntimeEnvironment,
    contractName: string,
    address: string,
    contractNameAlias?: string
  ): Promise<void> {
    const id = await this.getChainId(hre);
    await this.saveContractDeployData(
      hre.network.name,
      id,
      contractName,
      address,
      contractNameAlias
    );
  }
}

import Web3 from "web3";
import { ContractSettings } from "../utils/settings";

export const getMap = async (mapId, address) => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(ContractSettings.contractProvider)
  );
  const contract = new web3.eth.Contract(
    ContractSettings.contractABI,
    ContractSettings.contractAddress
  );

  return contract.methods
    .getMap(mapId)
    .call({ from: address, blockNumber: "latest" })
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const mintMap = async (mapId, direction, address) => {
  console.log("🚀 ~ file: web3.js:26 ~ mintMap ~ mapId:", mapId)
  console.log("🚀 ~ file: web3.js:26 ~ mintMap ~ direction:", direction)
  const web3 = new Web3(
    new Web3.providers.HttpProvider(ContractSettings.contractProvider)
  );
  const contract = new web3.eth.Contract(
    ContractSettings.contractABI,
    ContractSettings.contractAddress
  );

  return contract.methods
    .mintLand(mapId, direction)
    .send({ from: address, blockNumber: "latest", value: 0 })
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
}

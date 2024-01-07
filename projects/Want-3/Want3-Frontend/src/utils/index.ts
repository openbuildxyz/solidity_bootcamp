import { Web3 } from 'web3';
import fs from 'fs';

const web3 = new Web3('https://ethereum-holesky.publicnode.com');
// const contractABI = JSON.parse(fs.readFileSync('ContractABI.json', 'utf8'));
const contractABI =[
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "who",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "targetGoods",
        "type": "address"
      }
    ],
    "name": "addWant",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "donateFund",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]


const contractAddress = '0xbef40f131a17b916a82239cfefafe1487fa54b49'; // 替换为你的智能合约地址
const contract:any = new web3.eth.Contract(contractABI, contractAddress);
// console.log(contract)
// 添加news
export async function addWant(who: string, targetGoods: string): Promise<void> {
  try {
    // const whoAddress = web3.utils.toChecksumAddress(who);
    // const targetGoodsAddress = web3.utils.toChecksumAddress(targetGoods);
    console.log(who,targetGoods)
    await contract.methods.addWant(who, targetGoods)
      .send({ from: who });
    console.log('愿望已添加');
  } catch (error) {
    console.error('添加愿望时出错:', error);
    throw error;
  }
}

export async function donateFund(to: string): Promise<boolean> {
  try {
    const result = await contract.methods.donateFund(to).send();
    console.log('捐款成功');
    return result;
  } catch (error) {
    console.error('捐款时出错:', error);
    throw error;
  }
}

export async function getWantList(address: string): Promise<string> {
  try {
    const wantList = await contract.methods.wantList(address).call();
    console.log('Want List:', wantList);
    return wantList;
  } catch (error) {
    console.error('获取 Want List 时出错:', error);
    throw error;
  }
}

export async function getAccumulatedUserList(address: string): Promise<string[]> {
  try {
    const accumulatedUserList = await contract.methods.accumulatedUserList(address).call();
    console.log('Accumulated User List:', accumulatedUserList);
    return accumulatedUserList;
  } catch (error) {
    console.error('获取 Accumulated User List 时出错:', error);
    throw error;
  }
}

export async function getAccumulatedList(hostAddress: string, userAddress: string): Promise<number> {
  try {
    const accumulatedAmount = await contract.methods.accumulatedList(hostAddress, userAddress).call();
    console.log('Accumulated Amount:', accumulatedAmount);
    return accumulatedAmount;
  } catch (error) {
    console.error('获取 Accumulated Amount 时出错:', error);
    throw error;
  }
}

export async function getWithdrawInfo(address: string): Promise<number> {
  try {
    const withdrawInfo = await contract.methods.withdrawInfo(address).call();
    console.log('Withdraw Info:', withdrawInfo);
    return withdrawInfo;
  } catch (error) {
    console.error('获取 Withdraw Info 时出错:', error);
    throw error;
  }
}

export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ')
}

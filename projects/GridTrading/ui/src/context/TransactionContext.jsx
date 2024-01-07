import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractAddressPool, contractABIPool } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContractPool = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddressPool, contractABIPool, signer);
  return transactionsContract;
};



export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({ amount: "", publicKey: "", proveData: ""});
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState({ deposit: false, transfer: false, withdraw: false});

  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContractPool();
        const availableTransactions = await transactionsContract.nonce();

        var structuredTransactions =[];
        for(let _nonce=1; _nonce<=availableTransactions; _nonce++){
          const order = await transactionsContract.getOrderInfo(_nonce);

          var _priceListX64 =[];
          order.priceListX64.map((item, index) => {
            _priceListX64.push(item.toString());
          });

          structuredTransactions.push({
            nonce: _nonce.toString(),
            tokenA: order.tokenA,
            tokenB: order.tokenB,
            dealAmount: order.dealAmount.toString(), 
            priceRatio: order.priceRatio.toString(), 
            slippage: order.slippage.toString(), 
            amountA: order.amountA.toString(), 
            amountB: order.amountB.toString(), 
            priceListX64: _priceListX64 
          });
        }

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnectAndGetAllOrders = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
        
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };





  const sendTransactionDeposit = async () => {
    try {
      if (ethereum) {
        const { amount, dealAmount } = formData;
        const transactionsContract = createEthereumContractPool();
        const parsedAmount = ethers.utils.parseEther(amount);
       
        const transactionHash = await transactionsContract.testSetOrder({ value: parsedAmount});
        setIsLoading((prevState) => ({ ...prevState, deposit: true }));
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading((prevState) => ({ ...prevState, deposit: false }));
        
        
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  

  useEffect(()=>{
    setInterval(()=>{
      console.log("checkIfWalletIsConnectAndGetAllOrders");
      checkIfWalletIsConnectAndGetAllOrders();
    }, 5000);
  }, []);


  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransactionDeposit,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

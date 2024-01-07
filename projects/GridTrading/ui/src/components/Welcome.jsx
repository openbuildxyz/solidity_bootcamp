import React, { useContext } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";
import { Loader } from ".";

const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const Welcome = () => {
  const { currentAccount, connectWallet, handleChange, sendTransactionDeposit, sendTransactionTransfer, sendTransactionWithdraw, formData, isLoading } = useContext(TransactionContext);

  const depositSubmit = (e) => {

    const { amount, dealAmount } = formData;
    e.preventDefault();
    if (!amount && !dealAmount) return;
    sendTransactionDeposit();
  };

  const transferSubmit = (e) => {
    const { publicKey } = formData;
    e.preventDefault();
    if (!publicKey) return;
    sendTransactionTransfer();
  };

  const withdrawSubmit = (e) => {
    const { proveData } = formData;
    e.preventDefault();
    if (!proveData) return;
    sendTransactionWithdraw();
  };


  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            GridTrading Protocol
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            More Security and worry-free for the crypto world on GridTrading.
          </p>



          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
            <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
              Reliability
            </div>
            <div className={companyCommonStyles}>Security</div>
            <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
              Ethereum L2
            </div>
            <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
              Web 3.0
            </div>
            <div className={companyCommonStyles}>Low Fees</div>
            <div className={`rounded-br-2xl ${companyCommonStyles}`}>
              Blockchain
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          
          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">

            <div className="text-white text-1xl text-center my-2">
                LINK / WETH
            </div>
            <Input placeholder="Deposit Amount (ETH)" name="amount" type="number" handleChange={handleChange} />
            <Input placeholder="Base Deal Amount (ETH)" name="dealAmount" type="number" handleChange={handleChange} />
            
            {isLoading.deposit
              ? <Loader />
              : (
                <button
                  type="button"
                  onClick={depositSubmit}
                  className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Deposit
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

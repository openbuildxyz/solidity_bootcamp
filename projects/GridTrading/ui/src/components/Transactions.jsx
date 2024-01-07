import React, { useContext } from "react";

import { TransactionContext } from "../context/TransactionContext";

import { shortenAddress } from "../utils/shortenAddress";







const TransactionsCard = ({nonce, tokenA, tokenB, dealAmount, priceRatio, slippage, amountA, amountB, priceListX64}) => {

  return (
    <div className="bg-[#181918] m-4 flex flex-1
      2xl:min-w-[450px]
      2xl:max-w-[500px]
      sm:min-w-[270px]
      sm:max-w-[300px]
      min-w-full
      flex-col p-3 rounded-md hover:shadow-2xl"
    >
      <div className="flex flex-col items-center w-full mt-3">
        <div className="display-flex justify-start w-full mb-6 p-2">
          <p className="text-white text-base">nonce: {nonce} </p>
          <p className="text-white text-base">tokenA: {shortenAddress(tokenA)} </p>
          <p className="text-white text-base">tokenB: {shortenAddress(tokenB)} </p>
          <p className="text-white text-base">dealAmount: {dealAmount} </p>
          <p className="text-white text-base">priceRatio: {priceRatio} </p>
          <p className="text-white text-base">slippage: {slippage} </p>
          <p className="text-white text-base">amountA: {amountA} </p>
          <p className="text-white text-base">amountB: {amountB} </p>

          <p className="text-white text-base">priceListX64:</p>
          {[...priceListX64].map((item, i) => (
            <p className="text-white text-base" key={i}>{item} </p>
          ))}

        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const { transactions, currentAccount } = useContext(TransactionContext);

  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-services">
      <div className="flex flex-col md:p-12 py-12 px-4">

        {currentAccount ? (
          <h3 className="text-white text-3xl text-center my-2">
            Latest Orders
          </h3>
        ) : (
          <h3 className="text-white text-3xl text-center my-2">
            Connect your account to see the latest orders
          </h3>
        )}

        <div className="flex flex-wrap justify-center items-center mt-10">

          {[...transactions].reverse().map((transaction, i) => (
            <TransactionsCard key={i} {...transaction} />
          ))}
          
        </div>
      </div>
    </div>
  );
};

export default Transactions;

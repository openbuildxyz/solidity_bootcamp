// components/Surprise.js
import React, { useState } from 'react';

type DataItem = {
  content: string;
};

type DonationComponentProps = {
  data: DataItem[];
};

const Surprise = ({ data }: DonationComponentProps) => {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [donationAmount, setDonationAmount] = useState(0);

    return (
        <div className="flex justify-between">
            <div className="flex-1 border-r p-5">
                <h1 className="text-xl font-bold">标题</h1>
                {data.map((item, index) => (
                    <div key={index} className="p-2.5 border mt-2.5">
                        {/* Display the item content here */}
                        {item.content}
                    </div>
                ))}
            </div>
            <div className="flex-1 p-5">
                <div className="flex overflow-x-auto space-x-2.5">
                    {/* Assuming amounts to be [10, 20, 30, 40, 50] for the example */}
                    {[10, 20, 30, 40, 50].map((amount, index) => (
                        <button 
                            key={index} 
                            onClick={() => setSelectedAmount(amount)}
                            className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {amount}
                        </button>
                    ))}
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(parseInt(e.target.value))}
                  placeholder={`Donation Amount: ${selectedAmount}`}
                  className="mt-2.5 w-full p-2.5 border rounded-md"
                />
                </div>
                <button 
                    onClick={() => console.log(`Donated: ${donationAmount}`)}
                    className="mt-2.5 w-full bg-indigo-500 text-white p-2.5 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    结算
                </button>
            </div>
        </div>
    );
};

export default Surprise;

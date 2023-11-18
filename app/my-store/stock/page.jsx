"use client"

import AddNewStock from '@/components/stock/NewStock';
import React, { useState } from 'react';

const StocksPage = () => {
  const [isCreateStockExpanded, setCreateStockExpanded] = useState(false);
  const [isAddStockExpanded, setAddStockExpanded] = useState(false);

  const toggleCreateStock = () => {
    setCreateStockExpanded(!isCreateStockExpanded);
  };

  const toggleAddStock = () => {
    setAddStockExpanded(!isAddStockExpanded);
  };

  return (
    <div className="p-4 md:w-1/2 lg:w-1/3 md:mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Add a new Stock</h1>
      <ul>
        <li className="border border-gray-400 rounded-md px-2 py-1 my-2">
          <button
            className="text-gray-500"
            onClick={toggleCreateStock}
          >
            Create a New Fresh Stock
          </button>
          <div
            className={`transition-max-height overflow-hidden duration-700 ${isCreateStockExpanded ? 'max-h-screen' : 'max-h-0'}`}
          >
            {isCreateStockExpanded && <div className='mt-5'><AddNewStock /></div>}
          </div>
        </li>
        <li className="border border-gray-400 rounded-md px-2 py-1 my-2">
          <button
            className="text-gray-500"
            onClick={toggleAddStock}
          >
            Import and Edit Stock From Suggestions
          </button>
          <div
            className={`transition-max-height overflow-hidden duration-300 ${isAddStockExpanded ? 'max-h-96' : 'max-h-0'}`}
          >
            {isAddStockExpanded && <p className='mt-5'>Adding from existing stock...</p>}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default StocksPage;

"use client";

import ExistingStock from "@/components/stock/ExistingStock";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const StocksPage = () => {
  const router = useRouter();

  const [isAddStockExpanded, setAddStockExpanded] = useState(false);

  const toggleAddStock = () => {
    setAddStockExpanded(!isAddStockExpanded);
  };

  return (
    <div className="p-4 md:w-1/2 lg:w-1/3 md:mx-auto mb-20">
      <h1 className="text-2xl font-bold mb-4 text-center">Add a new Stock</h1>
      <ul className="flex flex-col gap-2">
        <Button
          className="w-full"
          variant={"secondary"}
          onClick={() => router.push("/my-store/stock/add-stock")}
        >
          Create a New Fresh Stock
        </Button>
        <Button variant="outline" onClick={toggleAddStock}>
          Import and Edit Stock From Suggestions
        </Button>
        <div
          className={`transition-max-height overflow-scroll duration-300 ${
            isAddStockExpanded ? "max-h-fit" : "max-h-0"
          }`}
        >
          {isAddStockExpanded && (
            <div className="mt-5">
              <ExistingStock />
            </div>
          )}
        </div>
      </ul>
    </div>
  );
};

export default StocksPage;

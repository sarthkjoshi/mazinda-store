"use client";

import ExistingStock from "@/components/stock/ExistingStock";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        <Link href={"/my-store/stock/add-stock"}>
          <Button className="w-full" variant={"secondary"}>
            Create a New Fresh Stock
          </Button>
        </Link>

        <Link href="/my-store/stock/bulk-upload">
          <Button className="w-full" variant={"secondary"}>
            Bulk Upload
          </Button>
        </Link>
        <Link href="/my-store/stock/browse-online">
          <Button className="w-full" variant={"secondary"}>
            Browse the Internet
          </Button>
        </Link>

        <Button variant="secondary" onClick={toggleAddStock}>
          Import and Edit Stock From Suggestions
        </Button>
        {isAddStockExpanded ? (
          <div
            className={`transition-max-height overflow-scroll border border-gray-200 duration-300 rounded-md ${
              isAddStockExpanded ? "max-h-fit" : "max-h-0"
            }`}
          >
            <div className="mt-5">
              <ExistingStock />
            </div>
          </div>
        ) : null}
      </ul>
    </div>
  );
};

export default StocksPage;

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import AddSingleProduct from "@/components/add-product/AddSingleProduct";

const SearchOnline = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState("");
  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState(null);

  async function fetchData() {
    setLoading(true);
    const URL = `https://www.amazon.in/s?k=${searchQuery.replace(
      " ",
      "+"
    )}+4&ref=nb_sb_noss_2`;

    const { data } = await axios.post("/api/scrape", {
      URL,
    });

    // console.log(data);
    setProductData({
      productNames: data.names,
      productImagePaths: data.images,
      productLinks: data.links,
    });
    setLoading(false);
  }

  const renderItem = (productName, imagePath, productLink, index) => {
    const handleAddToBucket = async () => {
      console.log(productName, imagePath);
      const { data } = await axios.post("/api/add-bucket", {
        productName,
        imagePath,
      });

      if (data.success) {
        toast.success("Product added to bucket");
      } else {
        toast.error("Oops, something went wrong");
      }
    };

    return (
      <div className="border rounded-md mb-2">
        <div className="flex items-center justify-between p-3">
          <div className="flex flex-col gap-3">
            <img
              className="w-[100px] h-[100px] object-contain"
              src={imagePath}
              alt={productName}
            />
            <span>{productName}</span>
            <a
              href={"https://amazon.in" + productLink}
              target="_blank"
              className="block text-blue-700 underline font-bold text-sm"
            >
              Click to view details
            </a>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setSelectedIndex(index)}>Choose</Button>
            <Button variant="secondary" onClick={handleAddToBucket}>
              Add to Bucket
            </Button>
          </div>
        </div>

        {selectedIndex === index ? (
          <AddSingleProduct
            productName={productData.productNames[index]}
            imagePath={productData.productImagePaths[index]}
          />
        ) : null}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="bg-white p-4 rounded-lg">
        <h1 className="text-lg">Browse products over the internet</h1>
        <div className="flex gap-1 my-3">
          <Input
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {loading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button onClick={() => fetchData()}>Search</Button>
          )}
        </div>

        {productData &&
          productData.productNames.map((productName, index) =>
            renderItem(
              productName,
              productData.productImagePaths[index],
              productData.productLinks[index],
              index
            )
          )}
      </div>
    </div>
  );
};

export default SearchOnline;

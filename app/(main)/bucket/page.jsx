"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
const ProductList = () => {
  const [bucketData, setBucketData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/fetch-bucket");
      console.log(data);
      if (data.success) {
        setBucketData(data.bucket);
      } else {
        toast.error("An error occurred while fetching bucket");
      }
    } catch (error) {
      console.error("Error fetching bucket data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const removeFromBucket = async (index) => {
    try {
      const { data } = await axios.post("/api/remove-from-bucket", {
        index,
      });
      if (data.success) {
        const updatedBucketData = [...bucketData];
        updatedBucketData.splice(index, 1);
        setBucketData(updatedBucketData);
        toast.success("Item removed from bucket successfully");
      } else {
        toast.error("Failed to remove item from bucket");
      }
    } catch (error) {
      console.error("Error removing item from bucket:", error);
    }
  };

  const handleDownloadCSV = () => {
    // Get product names and image URLs from the bucketData state
    const productData = bucketData.map((bucket) => ({
      productName: bucket.productName,
      imagePath: bucket.imagePath,
    }));

    // Template data with prefilled product names and image URLs
    const templateData = productData.map((data) => ({
      productName: data.productName,
      mrp: "",
      costPrice: "",
      salesPrice: "",
      category: "",
      subcategory: "",
      descriptionHeading: "",
      description: "",
      tags: "",
      imagePaths: data.imagePath,
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(templateData[0])
        .map((key) => key)
        .join(",") +
      "\n" +
      templateData
        .map((row) =>
          Object.values(row)
            .map((val) => `"${val}"`)
            .join(",")
        )
        .join("\n");

    // Create a temporary link and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "product_template.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="relative bg-white rounded-lg p-4">
      <h1 className="font-bold text-xl">Browse Your Bucket</h1>
      <div className="flex gap-2 flex-col md:flex-row mt-5">
        <Button onClick={handleDownloadCSV}>Download Template</Button>
      </div>
      <ul>
        {bucketData.length ? (
          bucketData.map((bucket, index) => (
            <li
              key={index}
              className="border p-5 rounded-xl flex flex-col gap-2 mt-3"
            >
              <div className="flex gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <Image
                    className="object-contain"
                    src={bucket.imagePath}
                    width={80}
                    height={80}
                    alt="product image"
                  />
                  <p className="font-semibold text-blue-950 mb-3">
                    {bucket.productName}
                  </p>
                </div>

                <Button
                  variant="destructive"
                  onClick={() => removeFromBucket(index)}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))
        ) : (
          <li className="pt-3 text-gray-500">
            {loading ? "Your bucket is empty" : "Loading"}
          </li>
        )}
      </ul>
    </div>
  );
};

export default ProductList;

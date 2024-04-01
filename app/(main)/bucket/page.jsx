"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
const ProductList = () => {
  const store = useSelector((state) => state.store.store);
  const [bucketData, setBucketData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [filePath, setFilePath] = useState("");
  useEffect(() => {
    // Fetch product data from the backend or set it from wherever you have it
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/fetch-bucket");
        console.log(response.data.bucket);
        setBucketData(response.data.bucket);
      } catch (error) {
        console.error("Error fetching bucket data:", error);
      }
    };

    fetchData();
  }, []);
  const handleUpload = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("storeName", store.storeName);

      // Send file to backend for processing and uploading to S3
      const { data } = await axios.post("/api/upload/upload-csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setFilePath(data.location);
        toast.success("File uploaded successfully");
      } else {
        toast.error("Oops, something went wrong");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };
  const handleCreateRequest = async () => {
    try {
      const { data } = await axios.post("/api/bulk-upload/create-request", {
        storeId: store._id,
        storeName: store.storeName,
        filePath,
      });
      if (data.success) {
        toast.success("Your request for bulk upload is successfully submitted");
      } else {
        toast.error("Oops, something went wrong. Please try again later");
      }
    } catch (err) {
      console.log(err);
    }
  };
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
              className="border p-5 rounded-xl flex flex-col gap-2 mt-2"
            >
              <div className="flex gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <Image
                    className="object-contain"
                    src={bucket.imagePath}
                    width={100}
                    height={100}
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
          <li className="pt-3 text-gray-500">Your bucket is empty</li>
        )}
      </ul>
    </div>
  );
};

export default ProductList;

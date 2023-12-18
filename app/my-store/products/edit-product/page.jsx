"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import OvalLoader from "@/components/utility/OvalLoader";
import { toast } from "react-toastify";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ProductDetails = () => {
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState({});
  const [editedDescription, setEditedDescription] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchProductData = async () => {
    try {
      const { data } = await axios.post("/api/product/fetch-product-by-id", {
        id,
      });
      if (data.success) {
        setProductData(data.product);
        setEditedDescription(data.product.description);
        setLoading(false);
      } else {
        console.error("Error while fetching the product");
      }
    } catch (error) {
      console.error("Error fetching product data: ", error);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    try {
      const { data } = await axios.put("/api/product/update", {
        productData: {
          ...productData,
          description: editedDescription,
        },
      });
      if (data.success) {
        toast.success(data.message, { autoClose: 3000 });
      } else {
        toast.error(data.message, { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error saving product data: ", error);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const updatedProductData = { ...productData };

    if (name.includes(".")) {
      const [fieldName, nestedField] = name.split(".");
      updatedProductData[fieldName] = {
        ...updatedProductData[fieldName],
        [nestedField]: type === "checkbox" ? checked : value,
      };
    } else {
      updatedProductData[name] = type === "checkbox" ? checked : value;
    }

    setProductData(updatedProductData);
  };

  const handleDescriptionChange = (index, field, event) => {
    const newDescription = [...editedDescription];
    newDescription[index][field] = event.target.value;
    setEditedDescription(newDescription);
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-xl">
      <h1 className="text-3xl font-semibold mb-4 text-center">
        Product Details
      </h1>
      {loading ? (
        <OvalLoader />
      ) : (
        <div className="flex flex-col items-center">
          {isEditing ? (
            <form className="space-y-4 w-full max-w-md">
              
              <div className="">
                <div>
                  <label className="block font-semibold">Product Name:</label>
                  <textarea
                    type="text"
                    name="productName"
                    value={productData.productName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold">MRP:</label>
                  <input
                    type="text"
                    name="pricing.mrp"
                    value={productData.pricing.mrp}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Cost Price:</label>
                  <input
                    type="text"
                    name="pricing.costPrice"
                    value={productData.pricing.costPrice}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block font-semibold">Description:</label>
                {editedDescription.map((desc, index) => (
                  <div
                    key={index}
                    className="border flex flex-col p-2 rounded-md my-2"
                  >
                    <input
                      className="border border-black py-1 px-2 my-2 rounded-md"
                      value={desc.heading}
                      onChange={(e) =>
                        handleDescriptionChange(index, "heading", e)
                      }
                    />
                    <textarea
                      className="border border-black py-1 px-2 my-2 rounded-md"
                      rows={12}
                      value={desc.description}
                      onChange={(e) =>
                        handleDescriptionChange(index, "description", e)
                      }
                    />
                  </div>
                ))}
              </div>
            </form>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className="mb-4 w-44">
                <img
                  className="w-full rounded-lg"
                  src={productData.imagePaths[0]}
                  alt={productData.name}
                />
              </div>

              <Table className="mt-3">
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>MRP</TableHead>
                    <TableHead className="">Cost Price</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      {productData.productName}
                    </TableCell>
                    <TableCell>{productData.category}</TableCell>
                    <TableCell>{productData.pricing.mrp}</TableCell>
                    <TableCell>{productData.pricing.costPrice}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {isEditing ? (
            <div className="flex w-full justify-center mb-5">
              <button
                onClick={handleSaveClick}
                className="bg-[#fb691e] w-1/4 my-2 mx-1 text-white px-4 py-2 rounded-md hover:opacity-70 focus:outline-none mb-10"
              >
                Save
              </button>

              <button
                onClick={() => setIsEditing(false)}
                className="w-1/4 my-2 mx-1 text-[#fb691e] border border-[#fb691e] px-4 py-2 rounded-md hover:opacity-70 focus:outline-none mb-10"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleEditClick}
              className="bg-[#fb691e] my-5 text-white px-10 py-2 rounded-md hover:opacity-70 focus:outline-none mb-20"
            >
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import OvalLoader from "@/components/utility/OvalLoader";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchProductData = async () => {
    try {
      const response = await axios.post("/api/product/fetch-product-by-id", {
        id,
      });
      if (response.data.success) {
        setProductData(response.data.product);
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
      const response = await axios.put("/api/product/update-product", {
        productData,
      });
      if (response.data.success) {
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error(response.data.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold">Product Name:</label>
                  <input
                    type="text"
                    name="productName"
                    value={productData.productName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Category:</label>
                  <input
                    type="text"
                    name="category"
                    value={productData.category}
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
              <div>
                <label className="block font-semibold">Image URI:</label>
                <input
                  type="text"
                  name="imageURI"
                  value={productData.imageURI}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold">Description:</label>
                <textarea
                  type="text"
                  name="description"
                  value={productData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>
            </form>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className="mb-4 w-44">
                <img
                  className="w-full rounded-lg"
                  src={productData.imageURI}
                  alt={productData.name}
                />
              </div>
              <div className="flex justify-between items-center md:w-1/2">
                <div className="w-full">
                  <div className="flex items-center justify-center">
                    {productData.approvalStatus ? (
                      <p className="text-lg my-2 bg-green-200 px-3 py-1 rounded-full w-fit text-green-800">
                        Approved
                      </p>
                    ) : (
                      <p className="text-lg my-2 bg-yellow-200 px-3 py-1 rounded-full w-fit text-yellow-500">
                        Pending
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="inline-block mx-2 my-3 font-semibold text-lg">
                      Product Name:
                    </p>
                    <p className="inline-block mx-2 text-lg">
                      {productData.productName}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="inline-block mx-2 my-3 font-semibold text-lg">
                      Category:
                    </p>
                    <p className="inline-block mx-2 text-lg">
                      {productData.category}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="inline-block mx-2 my-3 font-semibold text-lg">
                      MRP:
                    </p>
                    <p className="inline-block mx-2 text-lg">
                      {productData.pricing.mrp}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="inline-block mx-2 my-3 font-semibold text-lg">
                      Cost Price:
                    </p>
                    <p className="inline-block mx-2 text-lg">
                      {productData.pricing.costPrice}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="inline-block mx-2 my-3 font-semibold text-lg">
                      Trending:
                    </p>
                    <p className="inline-block mx-2 text-lg">
                      {productData.trending ? "Yes" : "No"}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="inline-block mx-2 my-3 font-semibold text-lg">
                      Top Deal:
                    </p>
                    <p className="inline-block mx-2 text-lg">
                      {productData.topDeal ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isEditing ? (
            <div className="flex w-full justify-center">
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

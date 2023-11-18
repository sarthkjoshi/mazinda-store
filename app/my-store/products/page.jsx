"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import OvalLoader from "@/components/utility/OvalLoader";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleAvailability = async (productId) => {
    const updatedProduct = products.filter((product) => {
      return product._id === productId;
    });

    const response = await axios.put("/api/product/update-product", {
      productData: {
        ...updatedProduct[0],
        isAvailable: !updatedProduct[0].isAvailable,
      },
    });
    console.log(response.data);

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId
          ? { ...product, isAvailable: !product.isAvailable }
          : product
      )
    );

    if (!response.data.success) {
      alert("Error while updating the product");
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const response = await axios.post("/api/product/fetch-store-products", {
      storeToken: Cookies.get("store_token"),
    });

    if (response.data.success) {
      // Filter products with approvalStatus true
      const approvedProducts = response.data.products.filter(
        (product) => product.approvalStatus === true
      );
      setProducts(approvedProducts);
    } else {
      console.error("An error occurred" + response.data.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4 md:w-1/2 mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Products</h1>

      {!loading ? (
        <div className="rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2">Product Name</th>
                <th className="py-2">Availability</th>
                <th className="py-2">Options</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="p-2 text-center">{product.productName.slice(0,25)}...</td>
                  <td className="py-2 text-center">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-toggle-switch"
                        checked={product.isAvailable}
                        onChange={() => toggleAvailability(product._id)}
                      />
                      <span className="ml-2">
                        {product.isAvailable ? "Available" : "Not Available"}
                      </span>
                    </label>
                  </td>
                  <td className="py-2 text-center">
                    <Link
                      href={`/my-store/products/edit-product?id=${product._id}`}
                      className="text-blue-500"
                    >
                      View / Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <OvalLoader />
      )}
    </div>
  );
};

export default ProductsPage;

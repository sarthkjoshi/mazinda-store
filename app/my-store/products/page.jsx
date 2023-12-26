"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import OvalLoader from "@/components/utility/OvalLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
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
    const { data } = await axios.post("/api/product/fetch-store-products", {
      storeToken: Cookies.get("store_token"),
    });

    if (data.success) {
      setProducts(data.products);

      // Separate products into approved and pending based on approvalStatus
      const approved = data.products.filter(
        (product) => product.approvalStatus === true
      );
      const pending = data.products.filter(
        (product) => product.approvalStatus === false
      );

      setApprovedProducts(approved);
      setPendingProducts(pending);
    } else {
      console.error("An error occurred" + data.message);
    }
    setLoading(false);
  };

  const productsTable = (products) => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead>Options</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-4">
                  <img className="w-10" src={product.imagePaths[0]} />
                  {product.productName.slice(0, 25)}...
                </div>
              </TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell>
                <Link
                  href={`/my-store/products/edit-product?id=${product._id}`}
                  className="text-blue-500"
                >
                  View / Edit
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4 md:w-1/2 mx-auto mb-20">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Products</h1>

      {!loading ? (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value="all">{productsTable(products)}</TabsContent>

          <TabsContent value="approved">
            {productsTable(approvedProducts)}
          </TabsContent>

          <TabsContent value="pending">
            {productsTable(pendingProducts)}
          </TabsContent>
        </Tabs>
      ) : (
        <OvalLoader />
      )}
    </div>
  );
};

export default ProductsPage;

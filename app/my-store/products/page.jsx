"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import OvalLoader from "@/components/utility/OvalLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from "react-redux";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ProductsPage = () => {
  const store = useSelector((state) => state.store.store);

  const products = useSelector((state) => state.store.products);

  const [approvedProducts, setApprovedProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [addStoryLoading, setAddStoryLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [specialPrice, setSpecialPrice] = useState(null);

  // const toggleAvailability = async (productId) => {
  //   const updatedProduct = products.filter((product) => {
  //     return product._id === productId;
  //   });

  //   const response = await axios.put("/api/product/update-product", {
  //     productData: {
  //       ...updatedProduct[0],
  //       isAvailable: !updatedProduct[0].isAvailable,
  //     },
  //   });
  //   console.log(response.data);

  //   setProducts((prevProducts) =>
  //     prevProducts.map((product) =>
  //       product._id === productId
  //         ? { ...product, isAvailable: !product.isAvailable }
  //         : product
  //     )
  //   );

  //   if (!response.data.success) {
  //     alert("Error while updating the product");
  //   }
  // };

  const addToStory = async () => {
    setAddStoryLoading(true);
    const store_token = Cookies.get("store_token");
    try {
      const { data } = await axios.post("/api/story/add-story", {
        product: selectedProduct,
        storeDetails: {
          _id: store._id,
          imageURI:
            "https://www.iconpacks.net/icons/2/free-store-icon-2017-thumb.png",
          storeName: store.storeName,
        },
        specialPrice,
        store_token,
        isSponsored: true,
      });

      console.log(data);
    } catch (e) {
      console.log(e);
    }

    setAddStoryLoading(false);
  };

  useEffect(() => {
    // Separate products into approved and pending based on approvalStatus
    const approved = products.filter(
      (product) => product.approvalStatus === true
    );
    const pending = products.filter(
      (product) => product.approvalStatus === false
    );

    setApprovedProducts(approved);
    setPendingProducts(pending);

    // setLoading(false);
  }, []);

  // if (loading) {
  //   return (
  //     <div>
  //       <OvalLoader />
  //     </div>
  //   );
  // }

  const productsTable = (products) => {
    return (
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="mb-5">
              {selectedProduct?.productName.slice(0, 50)}...
            </AlertDialogTitle>
            <div className="flex flex-col gap-2">
              <div className="flex gap-8">
                <span className="font-semibold text-sm">Cost price:</span>
                <span>₹{selectedProduct?.pricing.costPrice}</span>
              </div>
              <div className="flex gap-3 items-center">
                <span className="font-semibold text-sm">Special Price: </span>
                <input
                  value={specialPrice}
                  onChange={(e) => setSpecialPrice(e.target.value)}
                  className="border px-2 py-1 rounded-md"
                  type="text"
                />
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <button
              onClick={() => addToStory()}
              disabled={
                parseFloat(selectedProduct?.pricing?.costPrice) <
                parseFloat(specialPrice)
              }
              className={`border px-2 rounded-md text-sm text-white ${
                parseFloat(selectedProduct?.pricing?.costPrice) >
                parseFloat(specialPrice)
                  ? "bg-[#134272]"
                  : "bg-[#13427220]"
              }`}
            >
              {addStoryLoading ? <OvalLoader /> : "Continue"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>

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
              <TableRow key={product._id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <img className="w-8" src={product.imagePaths[0]} />
                    {product.productName.slice(0, 20)}...
                  </div>
                </TableCell>
                <TableCell>
                  <label className="inline-flex items-center">
                    {/* <input
                    type="checkbox"
                    className="form-toggle-switch"
                    checked={product.isAvailable}
                    onChange={() => toggleAvailability(product._id)}
                  /> */}
                    <span className="bg-green-200 text-green-600 px-1 rounded-xl text-[10px]">
                      {product.isAvailable ? "Available" : "Not Available"}
                    </span>
                  </label>
                </TableCell>
                <TableCell className="">
                  <div className="flex items-center gap-3 flex-col">
                    <Link
                      href={`/my-store/products/edit-product?id=${product._id}`}
                      className="text-[12px] md:text-sm text-white bg-yellow-400 px-2 rounded-md"
                    >
                      Edit
                    </Link>

                    <AlertDialogTrigger
                      onClick={() => setSelectedProduct(product)}
                      className="bg-[#134272] text-white px-1 md:px-2 rounded-md text-[8px] md:text-sm"
                    >
                      Put Status
                    </AlertDialogTrigger>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AlertDialog>
    );
  };

  return (
    <div className="p-4 md:w-1/2 mx-auto mb-20">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Products</h1>

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
    </div>
  );
};

export default ProductsPage;

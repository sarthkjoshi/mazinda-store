"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import OvalLoader from "@/components/utility/OvalLoader";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Table,
  TableBody,
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

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const handleTagsChange = (e) => {
    const newTags = e.target.value
      .replace(/ /g, "")
      .split(",")
      .map((tag) => tag.trim());
    setProductData((prevData) => ({
      ...prevData,
      tags: newTags,
    }));
  };

  const handleRemoveTag = (tag) => {
    const updatedTags = productData.tags.filter((t) => t !== tag);
    setProductData((prevData) => ({
      ...prevData,
      tags: updatedTags,
    }));
  };

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

  const handleProductDelete = async (_id) => {
    const { data } = await axios.put("/api/product/delete", { _id });
    if (data.success) {
      toast.success("Product deleted successfully");
      router.push("/my-store/products");
    } else {
      toast.error("Error deleting the product");
    }
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
    <div className="container mx-auto bg-white rounded-xl">
      <h1 className="text-3xl font-semibold mb-4 text-center">
        Product Details
      </h1>
      {loading ? (
        <OvalLoader />
      ) : (
        <div className="flex flex-col items-center">
          {isEditing ? (
            <form className="space-y-4 md:w-1/2 mb-20">
              <div className="">
                <div>
                  <label className="block font-semibold">Product Name:</label>
                  <Input
                    type="text"
                    name="productName"
                    value={productData.productName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold">MRP:</label>
                  <Input
                    type="text"
                    name="pricing.mrp"
                    value={productData.pricing.mrp}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block font-semibold">Cost Price:</label>
                  <Input
                    type="text"
                    name="pricing.costPrice"
                    value={productData.pricing.costPrice}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block font-semibold">Selling Price(Optional):</label>
                  <Input
                    type="text"
                    name="pricing.salesPrice"
                    value={productData.pricing.salesPrice}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block font-semibold">Description:</label>
                {editedDescription.map((desc, index) => (
                  <div
                    key={index}
                    className="border flex flex-col p-2 rounded-md my-2 gap-2"
                  >
                    <Input
                      value={desc.heading}
                      onChange={(e) =>
                        handleDescriptionChange(index, "heading", e)
                      }
                    />
                    <Textarea
                      rows={12}
                      value={desc.description}
                      onChange={(e) =>
                        handleDescriptionChange(index, "description", e)
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <label htmlFor="tags" className="block font-medium my-2">
                  Tags:
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={productData.tags.join(", ")}
                    onChange={handleTagsChange}
                    placeholder="Enter tags (comma separated)"
                  />
                </div>
                {productData.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {productData.tags.map((tag, index) => (
                      <Badge variant="secondary" key={index}>
                        {tag}
                        <button
                          type="button"
                          variant="destructive"
                          className="ml-2 text-red-500"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          x
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-full flex justify-end mt-4 gap-2">
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveClick}>Save</Button>
              </div>
            </form>
          ) : (
            <div className="md:w-1/2 flex flex-col items-center">
              <div className="mb-4 w-44">
                <img
                  className="w-full rounded-lg"
                  src={productData.imagePaths[0]}
                  alt={productData.name}
                />
              </div>

              <div className="flex gap-2 mt-4">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the product.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="px-0">
                        <Button
                          onClick={() => handleProductDelete(productData._id)}
                          variant="destructive"
                        >
                          Continue
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  className="px-7"
                  variant="secondary"
                  onClick={handleEditClick}
                >
                  Edit
                </Button>
              </div>

              <Table className="mt-3">
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>MRP</TableHead>
                    <TableHead className="">Cost Price</TableHead>
                    <TableHead className="">Selling Price</TableHead>
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
                    <TableCell>{productData.pricing.salesPrice}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

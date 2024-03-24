import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "sonner";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Badge } from "../ui/badge";
import axios from "axios";
import { useSession } from "next-auth/react";

const AddSingleProduct = ({ productName, imagePath }) => {
  const { data: session, status } = useSession();

  console.log(session);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [productData, setProductData] = useState({
    productName: productName,
    storeId: session.user,
    category: "",
    subcategory: "",
    imagePaths: [imagePath],
    pricing: {
      mrp: "",
      costPrice: "",
    },
    description: [{ heading: "", description: "" }],
    tags: [],
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchCategoriesAndSubcategories = async () => {
    try {
      const { data } = await axios.post("/api/category/fetch-categories");

      const fetchedCategories = data.categories.map(
        (category) => category.categoryName
      );
      setCategories(fetchedCategories);
      setLoadingCategories(false);

      // If a category is selected, fetch its subcategories
      if (productData.category) {
        const selectedCategoryData = data.categories.find(
          (category) => category.categoryName === productData.category
        );

        if (selectedCategoryData) {
          const fetchedSubCategories = selectedCategoryData.subcategories || [];
          setSubcategories(fetchedSubCategories);
        } else {
          console.error(`Category "${productData.category}" not found.`);
        }
      }
    } catch (error) {
      console.error("Error fetching categories and subcategories:", error);
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAndSubcategories();
  }, [productData.category]);

  const handlePricingChange = (e) => {
    const { name, value } = e.target;

    setProductData((prevData) => {
      // Update the general pricing
      return {
        ...prevData,
        pricing: {
          ...prevData.pricing,
          [name]: value,
        },
      };
    });
  };

  const handleHeadingDescriptionChange = (index, e) => {
    const { name, value } = e.target;

    setProductData((prevData) => {
      // Update the general description
      const updatedDescription = [...prevData.description];
      updatedDescription[index] = {
        ...updatedDescription[index],
        [name]: value,
      };

      return {
        ...prevData,
        description: updatedDescription,
      };
    });
  };

  const handleTagsChange = (e) => {
    const newTags = e.target.value.split(",").map((tag) => tag.trim());
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const productDataWithoutVariants = {
        ...productData,
        variants: {},
      };

      const { data } = await axios.post("/api/product/add-new-product", {
        productData: productDataWithoutVariants,
      });

      if (data.success) {
        toast.success(data.message, { autoClose: 3000 });
      } else {
        toast.error(data.message, { autoClose: 3000 });
      }

      // Reset state after successful submission
      setProductData({
        productName: "",
        storeId: session.user.id,
        category: "",
        subcategory: "",
        imagePaths: [],
        pricing: {
          mrp: "",
          costPrice: "",
        },
        description: [{ heading: "", description: "" }],
        tags: [],
      });
    } catch (error) {
      toast.error(error.message, { autoClose: 3000 });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="p-3 flex flex-col gap-5 bg-gray-50">
      <div className="flex flex-col gap-1 bg-white p-3 rounded-md">
        <Label htmlFor="productName" className="text-md">
          Product Name
        </Label>
        <Textarea
          type="text"
          id="productName"
          name="productName"
          value={productData.productName}
          onChange={(e) =>
            setProductData((prev) => ({
              ...prev,
              productName: e.target.value,
            }))
          }
        />
      </div>

      {/* <div className="flex flex-col gap-2 mt-2">
        {productData.imagePaths.length > 0 && (
          <div>
            <ul className="flex flex-wrap gap-4">
              {productData.imagePaths.map((imageName, index) => (
                <img
                  className="w-24 aspect-square border rounded-md p-2 object-contain"
                  src={imageName}
                  key={index}
                />
              ))}
            </ul>
          </div>
        )}
      </div> */}

      <div className="bg-white p-3 rounded-md">
        <Label className="text-md">Product Pricing Details</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="mrp">MRP:</Label>
            <Input
              type="text"
              id="mrp"
              name="mrp"
              value={productData.pricing.mrp}
              onChange={handlePricingChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="costPrice">Cost Price:</Label>
            <Input
              type="text"
              id="costPrice"
              name="costPrice"
              value={productData.pricing.costPrice}
              onChange={handlePricingChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="salesPrice">Selling Price(Optional):</Label>
            <Input
              type="text"
              id="salesPrice"
              name="salesPrice"
              value={productData.pricing.salesPrice}
              onChange={handlePricingChange}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-2 bg-white p-3 rounded-md">
        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="category" className="text-md">
            Category:
          </Label>
          <select
            id="category"
            name="category"
            className="w-full p-2 border border-gray-300 rounded-md text-gray-600 bg-white"
            value={productData.category}
            onChange={(e) => handleFieldChange(e)}
          >
            <option value="">Category</option>
            {loadingCategories ? (
              <option value="" disabled>
                Loading Categories...
              </option>
            ) : (
              categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="subcategory" className="text-md">
            Sub-Category:
          </Label>
          <select
            id="subcategory"
            name="subcategory"
            className="w-full p-2 border border-gray-300 rounded-md text-gray-600 bg-white"
            value={productData.subcategory}
            onChange={handleFieldChange}
          >
            <option value="">Subcategory</option>
            {productData.category === "" ? (
              <option value="" disabled>
                Select a Category
              </option>
            ) : (
              subcategories.map((subcat) => (
                <option key={subcat} value={subcat}>
                  {subcat}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2 bg-white p-3 rounded-md">
        <Label htmlFor="tags" className="text-md">
          Tags:
        </Label>
        <div className="flex items-center">
          <Input
            type="text"
            id="tags"
            name="tags"
            value={productData.tags.join(", ")}
            onChange={handleTagsChange}
            placeholder="Enter tags (comma separated)"
          />
        </div>
        {productData.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {productData.tags
              .filter((tag) => tag !== "")
              .map((tag, index) => (
                <Badge variant="secondary" key={index}>
                  {tag}
                  <button
                    type="button"
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

      <div className="bg-white p-3 rounded-md">
        <Label htmlFor="description" className="text-md">
          Add Product Descriptions:
        </Label>
        {productData.description.map((hd, index) => (
          <div key={index} className="flex flex-col gap-2 mb-2">
            <Input
              type="text"
              name="heading"
              placeholder="Heading"
              value={hd.heading}
              onChange={(e) => handleHeadingDescriptionChange(index, e)}
            />
            <Textarea
              name="description"
              placeholder="Description"
              value={hd.description}
              onChange={(e) => handleHeadingDescriptionChange(index, e)}
            />
          </div>
        ))}
        <Button
          variant="secondary"
          onClick={() =>
            setProductData((prev) => ({
              ...prev,
              description: [
                ...prev.description,
                { heading: "", description: "" },
              ],
            }))
          }
        >
          Add Another Heading - Description
        </Button>
      </div>

      {submitLoading ? (
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button className="w-fit" onClick={() => handleSubmit()}>
          Submit For Approval
        </Button>
      )}
    </div>
  );
};

export default AddSingleProduct;

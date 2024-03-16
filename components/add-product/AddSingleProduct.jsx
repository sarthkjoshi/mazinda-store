import React, { useState } from "react";
import Cookies from "js-cookie";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "sonner";

const AddSingleProduct = ({ productName, imagePath }) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [productData, setProductData] = useState({
    productName: productName,
    storeToken: Cookies.get("store_token"),
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
        storeToken: Cookies.get("store_token"),
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
    <div className="p-3">
      <div className="mb-4 flex flex-col gap-1">
        <Label htmlFor="productName" className="block font-medium">
          Product Name
        </Label>
        <Input
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

      <div className="flex flex-col gap-2 mt-2">
        {/* Display the list of uploaded image filenames */}

        {productData.imagePaths.length > 0 && (
          <div>
            {/* <h2 className="mb-3">Uploaded Images:</h2> */}
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
      </div>

      <div className="mt-10">
        <Label className="text-md">Product Pricing Details</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="mb-4 flex flex-col gap-1">
            <Label htmlFor="mrp">MRP:</Label>
            <Input
              type="text"
              id="mrp"
              name="mrp"
              value={productData.pricing.mrp}
              onChange={handlePricingChange}
            />
          </div>
          <div className="mb-4 flex flex-col gap-1">
            <Label htmlFor="costPrice">Cost Price:</Label>
            <Input
              type="text"
              id="costPrice"
              name="costPrice"
              value={productData.pricing.costPrice}
              onChange={handlePricingChange}
            />
          </div>
          <div className="mb-4 flex flex-col gap-1">
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

      <div className="mb-4">
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
        <Button onClick={() => handleSubmit()}>Submit</Button>
      )}
    </div>
  );
};

export default AddSingleProduct;

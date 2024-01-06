"use client";

import BasicDetails from "@/components/add-product/BasicDetails";
import ReviewProduct from "@/components/add-product/ReviewProduct";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { toast } from "react-toastify";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AddNewStock = () => {
  const [counter, setCounter] = useState(0);
  const [selectedVariantCategory, setSelectedVariantCategory] = useState("");
  const [selectedVariants, setSelectedVariants] = useState({});
  const [variantInput, setVariantInput] = useState("");

  const [file, setFile] = useState();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [productData, setProductData] = useState({
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
    variants: {},
    variantsInfo: {},
  });

  function generateRandomAlphanumeric() {
    const alphanumericCharacters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(
        Math.random() * alphanumericCharacters.length
      );
      result += alphanumericCharacters.charAt(randomIndex);
    }

    return result;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (Object.keys(productData.variants).length === 0) {
        // Handle the case where there are no variants
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
      } else {
        const variantId = generateRandomAlphanumeric();
        // Iterate over selected combinations for products with variants
        for (const combination of Object.keys(productData.variants)) {
          if (combination !== "0") {
            const productDataForCombination = {
              ...productData,
              productName: productData.variants[combination]?.productName,

              pricing: {
                ...productData.variants[combination]?.pricing,
              },
              description: [
                ...(productData.variants[combination]?.description || []),
              ],
              imagePaths: [
                ...(productData.variants[combination]?.imagePaths || []),
              ],
              variantsInfo: selectedVariants,
              combinationName: combination,
              variantId,
            };

            const { data } = await axios.post("/api/product/add-new-product", {
              productData: productDataForCombination,
            });

            if (data.success) {
              toast.success(data.message, { autoClose: 3000 });
            } else {
              toast.error(data.message, { autoClose: 3000 });
            }
          }
        }
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
        variants: {},
        variantsInfo: {},
      });
      setFile(null);
      setCounter(0);
      setSelectedVariants({});
    } catch (error) {
      toast.error(error.message, { autoClose: 3000 });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleProductNameChange = (e, combination) => {
    const { value } = e.target;

    setProductData((prevData) => {
      const updatedVariants = { ...prevData.variants };

      if (combination) {
        // Update the specific combination's productName
        const combinationData = updatedVariants[combination] || {
          imagePaths: [],
          description: [],
          pricing: {},
        };

        updatedVariants[combination] = {
          ...combinationData,
          productName: value,
        };
      } else {
        // Update the general productName
        return {
          ...prevData,
          productName: value,
          variants: { ...updatedVariants },
        };
      }

      return {
        ...prevData,
        variants: { ...updatedVariants },
      };
    });
  };

  const handlePricingChange = (e, combination) => {
    const { name, value } = e.target;

    setProductData((prevData) => {
      if (combination) {
        // Update the pricing for the specific combination
        const updatedVariants = { ...prevData.variants };

        if (updatedVariants[combination]) {
          updatedVariants[combination].pricing = {
            ...updatedVariants[combination].pricing,
            [name]: value,
          };
        }

        return {
          ...prevData,
          variants: updatedVariants,
        };
      } else {
        // Update the general pricing
        return {
          ...prevData,
          pricing: {
            ...prevData.pricing,
            [name]: value,
          },
        };
      }
    });
  };

  const handleHeadingDescriptionChange = (index, e, combination) => {
    const { name, value } = e.target;

    setProductData((prevData) => {
      if (combination) {
        // Update the description for the specific combination
        const updatedVariants = { ...prevData.variants };

        if (updatedVariants[combination]) {
          const updatedDescription = [
            ...(updatedVariants[combination].description || []),
          ];
          updatedDescription[index] = {
            ...updatedDescription[index],
            [name]: value,
          };

          updatedVariants[combination].description = updatedDescription;
        }

        return {
          ...prevData,
          variants: updatedVariants,
        };
      } else {
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
      }
    });
  };

  const onFileSubmit = async (e, combination) => {
    e.preventDefault();
    setUploadLoading(true);

    if (!file) return;

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(await res.text());
      }

      const filePath = json.location;
      toast.success("Image uploaded successfully");

      setProductData((prevData) => {
        const updatedVariants = { ...prevData.variants };

        if (combination) {
          // Update the specific combination's imagePaths
          const combinationData = updatedVariants[combination] || {
            imagePaths: [],
            description: [],
            pricing: {},
          };

          updatedVariants[combination] = {
            ...combinationData,
            imagePaths: [...combinationData.imagePaths, filePath],
          };
        } else {
          // Update the general imagePaths
          prevData.imagePaths = [...prevData.imagePaths, filePath];
        }

        return {
          ...prevData,
          variants: { ...updatedVariants },
        };
      });

      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Error uploading image");
    } finally {
      setUploadLoading(false);
    }
  };

  const generateCombinations = () => {
    const combinations = [];

    // Get all the variant categories
    const variantCategories = Object.keys(selectedVariants);

    // Helper function to generate combinations recursively
    const generate = (currentCombination, index) => {
      if (index === variantCategories.length) {
        combinations.push(currentCombination.join("-"));
        return;
      }

      const currentCategory = variantCategories[index];
      const values = selectedVariants[currentCategory];

      values.forEach((value) => {
        generate([...currentCombination, value], index + 1);
      });
    };

    generate([], 0); // Start the recursive generation with an empty array

    return combinations;
  };

  const generatedCombinations = generateCombinations();

  return (
    <div className="relative h-[80vh] md:w-1/2 mx-auto">
      <div className="w-full flex gap-2 bg-white py-2 px-4 items-center justify-between mb-10">
        <span className="text-xl">
          {counter === 0
            ? "Basic Information"
            : counter === 1
            ? "Varient Info"
            : counter === 2
            ? "More Details"
            : counter === 3
            ? "Review and Add Product"
            : null}
        </span>
        <div className="flex gap-2">
          <Button onClick={() => setCounter(counter - 1)} variant="secondary">
            Previous
          </Button>
          {counter === 3 ? (
            submitLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" onClick={handleSubmit}>
                Add Product
              </Button>
            )
          ) : (
            <Button onClick={() => setCounter(counter + 1)}>Continue</Button>
          )}
        </div>
      </div>
      <div className="px-4">
        {counter === 0 ? (
          <BasicDetails
            productData={productData}
            setProductData={setProductData}
          />
        ) : counter === 1 ? (
          <div className="min-h-[73vh]">
            <RadioGroup
              defaultValue={
                Object.keys(productData.variants).length ? "yes" : "no"
              }
            >
              <Label className="text-lg">
                Does your product have variants ?
              </Label>
              <div className="flex items-center space-x-2 mt-3">
                <RadioGroupItem
                  onClick={() => {
                    setProductData({ ...productData, variants: {} });
                  }}
                  value="no"
                  id="no"
                />
                <Label htmlFor="no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  onClick={() => {
                    setProductData({ ...productData, variants: { 0: {} } });
                  }}
                  value="yes"
                  id="yes"
                />
                <Label htmlFor="yes">Yes</Label>
              </div>
            </RadioGroup>

            {Object.keys(productData.variants).length ? (
              <div className="my-5">
                <Drawer>
                  <DrawerTrigger>
                    <Button variant="secondary">Add variant Category</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="flex flex-col items-center">
                      <DrawerTitle>Choose a variant Category</DrawerTitle>
                      <DrawerDescription>
                        ex. - Colour, Size, Quantity, etc
                      </DrawerDescription>
                    </DrawerHeader>

                    <div className="w-full flex items-center justify-center my-10">
                      <Select
                        onValueChange={(value) =>
                          setSelectedVariantCategory(value)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Choose variant Subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="colour">Colour</SelectItem>
                          <SelectItem value="size">Size</SelectItem>
                          <SelectItem value="quantity">Quantity</SelectItem>
                          <SelectItem value="weight">Weight</SelectItem>
                          <SelectItem value="storage">Storage</SelectItem>
                          <SelectItem value="ram">RAM</SelectItem>
                          <SelectItem value="flavour">Flavour</SelectItem>
                          <SelectItem value="variant">Variant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DrawerFooter>
                      <div className="flex justify-center gap-3">
                        <DrawerClose>
                          <Button variant="outline">Cancel</Button>
                        </DrawerClose>

                        <DrawerClose>
                          <Button
                            onClick={() => {
                              setSelectedVariants((prevVariants) => ({
                                ...prevVariants,
                                [selectedVariantCategory]: [],
                              }));
                            }}
                          >
                            Add
                          </Button>
                        </DrawerClose>
                      </div>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>

                {Object.keys(selectedVariants).length ? (
                  <Accordion type="single" collapsible>
                    {Object.keys(selectedVariants).map(
                      (variantCategory, index) => (
                        <AccordionItem value={variantCategory} key={index}>
                          <AccordionTrigger>{variantCategory}</AccordionTrigger>
                          <AccordionContent className="p-2">
                            <div className="flex gap-2">
                              <Input
                                type="text"
                                value={variantInput}
                                onChange={(e) =>
                                  setVariantInput(e.target.value)
                                }
                              />
                              <Button
                                onClick={() => {
                                  selectedVariants[variantCategory] = [
                                    ...selectedVariants[variantCategory],
                                    variantInput,
                                  ];
                                  setVariantInput("");
                                }}
                                variant="secondary"
                              >
                                Add variant
                              </Button>
                            </div>

                            <div className="mt-2 flex gap-2">
                              {selectedVariants[variantCategory].map(
                                (data, index) => (
                                  <Badge
                                    className="text-md"
                                    key={index}
                                    variant="outline"
                                  >
                                    {data}
                                  </Badge>
                                )
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    )}
                  </Accordion>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : counter === 2 ? (
          <div className="mb-20">
            {Object.keys(productData.variants).length ? (
              <div>
                {generatedCombinations.length > 0 && (
                  <div className="mb-20">
                    <h2 className="mb-3 text-lg">Select Combinations</h2>
                    <ul className="flex flex-col gap-2">
                      {generatedCombinations.map((combination, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-2 mb-2 border px-4 py-3 rounded-md"
                        >
                          <div className="flex gap-3">
                            <input
                              type="checkbox"
                              onChange={() => {
                                // Handle checkbox change for the combination
                                setProductData((prevData) => {
                                  const variantsCopy = { ...prevData.variants };

                                  if (variantsCopy[combination]) {
                                    // Remove the combination if it was checked
                                    delete variantsCopy[combination];
                                  } else {
                                    // Add the combination if it was unchecked
                                    variantsCopy[combination] = {
                                      productName: "",
                                      imagePaths: [],
                                      description: [
                                        { heading: "", description: "" },
                                      ],
                                      pricing: {},
                                    };
                                  }

                                  return {
                                    ...prevData,
                                    variants: variantsCopy,
                                  };
                                });
                              }}
                            />
                            <label>{combination}</label>
                          </div>

                          {/* Show inputs for images, pricing, and description if the combination is checked */}
                          {productData.variants[combination] && (
                            <div>
                              <div className="mb-4 flex flex-col gap-1">
                                <Label
                                  htmlFor="productName"
                                  className="block font-medium"
                                >
                                  Product Name for {combination}
                                </Label>
                                <Input
                                  type="text"
                                  id="productName"
                                  name="productName"
                                  value={
                                    productData.variants[combination]
                                      .productName
                                  }
                                  onChange={(e) =>
                                    handleProductNameChange(e, combination)
                                  }
                                />
                              </div>
                              <Label className="text-md">
                                Images for {combination}
                              </Label>

                              <div className="flex gap-2">
                                <Input
                                  id="file"
                                  type="file"
                                  onChange={(e) => setFile(e.target.files?.[0])}
                                />

                                {uploadLoading ? (
                                  <Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={(e) =>
                                      onFileSubmit(e, combination)
                                    }
                                    disabled={
                                      !file ||
                                      uploadLoading ||
                                      productData.variants[combination]
                                        .imagePaths.length >= 10
                                    }
                                  >
                                    Upload
                                  </Button>
                                )}
                              </div>

                              <div className="flex flex-col gap-2 mt-2">
                                <div>
                                  {productData.variants[combination].imagePaths
                                    .length > 0 && (
                                    <Label className="text-yellow-400 text-lg">
                                      You can add{" "}
                                      {parseInt(
                                        10 -
                                          productData.variants[combination]
                                            .imagePaths.length
                                      )}{" "}
                                      more images
                                    </Label>
                                  )}
                                </div>

                                {/* Display the list of uploaded image filenames */}

                                {productData.variants[combination].imagePaths
                                  .length > 0 && (
                                  <div>
                                    <h2 className="mb-3">Uploaded Images:</h2>
                                    <ul className="flex flex-wrap gap-4">
                                      {productData.variants[
                                        combination
                                      ].imagePaths.map((imageName, index) => (
                                        <img
                                          className="w-24 aspect-square border rounded-md p-2"
                                          src={imageName}
                                          key={index}
                                        />
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>

                              <div className="mt-10">
                                <Label className="text-md">
                                  Pricing for {combination}
                                </Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  <div className="mb-4 flex flex-col gap-1">
                                    <Label htmlFor="mrp">MRP:</Label>
                                    <Input
                                      type="text"
                                      id="mrp"
                                      name="mrp"
                                      value={
                                        productData.variants[combination]
                                          .pricing.mrp
                                      }
                                      onChange={(e) =>
                                        handlePricingChange(e, combination)
                                      }
                                    />
                                  </div>
                                  <div className="mb-4 flex flex-col gap-1">
                                    <Label htmlFor="costPrice">
                                      Cost Price:
                                    </Label>
                                    <Input
                                      type="text"
                                      id="costPrice"
                                      name="costPrice"
                                      value={
                                        productData.variants[combination]
                                          .pricing.costPrice
                                      }
                                      onChange={(e) =>
                                        handlePricingChange(e, combination)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="mb-4">
                                <Label
                                  htmlFor="description"
                                  className="text-md"
                                >
                                  Description for {combination}
                                </Label>
                                {productData.variants[
                                  combination
                                ].description.map((hd, index) => (
                                  <div
                                    key={index}
                                    className="flex flex-col gap-2 mb-2"
                                  >
                                    <Input
                                      type="text"
                                      name="heading"
                                      placeholder="Heading"
                                      value={hd.heading}
                                      onChange={(e) =>
                                        handleHeadingDescriptionChange(
                                          index,
                                          e,
                                          combination
                                        )
                                      }
                                    />
                                    <Textarea
                                      name="description"
                                      placeholder="Description"
                                      value={hd.description}
                                      onChange={(e) =>
                                        handleHeadingDescriptionChange(
                                          index,
                                          e,
                                          combination
                                        )
                                      }
                                    />
                                  </div>
                                ))}
                                <Button
                                  variant="secondary"
                                  onClick={() =>
                                    setProductData((prev) => {
                                      const updatedVariants = {
                                        ...prev.variants,
                                        [combination]: {
                                          ...prev.variants[combination],
                                          description: [
                                            ...(prev.variants[combination]
                                              ?.description || []),
                                            { heading: "", description: "" },
                                          ],
                                        },
                                      };

                                      return {
                                        ...prev,
                                        variants: updatedVariants,
                                      };
                                    })
                                  }
                                >
                                  Add Another Heading - Description
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-4 flex flex-col gap-1">
                  <Label htmlFor="productName" className="block font-medium">
                    Product Name
                  </Label>
                  <Input
                    type="text"
                    id="productName"
                    name="productName"
                    value={productData.productName}
                    onChange={handleProductNameChange}
                  />
                </div>
                <Label className="text-md" htmlFor="file">
                  Upload Product Images (Upto 10)
                </Label>

                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex gap-2">
                    <Input
                      id="file"
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0])}
                    />

                    {uploadLoading ? (
                      <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading
                      </Button>
                    ) : (
                      <Button
                        onClick={onFileSubmit}
                        disabled={
                          !file ||
                          uploadLoading ||
                          productData.imagePaths.length >= 10
                        }
                      >
                        Upload
                      </Button>
                    )}
                  </div>

                  <div>
                    {productData.imagePaths.length > 0 && (
                      <Label className="text-yellow-400 text-lg">
                        You can add{" "}
                        {parseInt(10 - productData.imagePaths.length)} more
                        images
                      </Label>
                    )}
                  </div>

                  {/* Display the list of uploaded image filenames */}

                  {productData.imagePaths.length > 0 && (
                    <div>
                      <h2 className="mb-3">Uploaded Images:</h2>
                      <ul className="flex flex-wrap gap-4">
                        {productData.imagePaths.map((imageName, index) => (
                          <img
                            className="w-24 aspect-square border rounded-md p-2"
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
                  <div className="grid grid-cols-2 gap-2 mt-2">
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
                        onChange={(e) =>
                          handleHeadingDescriptionChange(index, e)
                        }
                      />
                      <Textarea
                        name="description"
                        placeholder="Description"
                        value={hd.description}
                        onChange={(e) =>
                          handleHeadingDescriptionChange(index, e)
                        }
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
              </div>
            )}
          </div>
        ) : (
          <ReviewProduct productData={productData} />
        )}
      </div>
    </div>
  );
};

export default AddNewStock;

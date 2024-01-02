import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddNewStock = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [subcategories, setSubcategories] = useState([]);

  const [file, setFile] = useState();
  const [uploadLoading, setUploadLoading] = useState(false);

  const [imagePaths, setImagePaths] = useState([]);

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
  });

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
          console.error(
            `Category "${productData.category}" not found in categoriesData.`
          );
        }
        // setLoadingSubcategories(false);
      }
    } catch (error) {
      console.error("Error fetching categories and subcategories:", error);
      setLoadingCategories(false);
      // setLoadingSubcategories(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAndSubcategories();
  }, [productData.category]);

  const handleHeadingDescriptionChange = (index, e) => {
    const { name, value } = e.target;
    setProductData((prevData) => {
      const updatedDescription = [...prevData.description];
      updatedDescription[index][name] = value;
      return {
        ...prevData,
        description: updatedDescription,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(productData);

    // Validation checks
    if (
      productData.productName === "" ||
      productData.category === "" ||
      productData.subcategory === "" ||
      productData.pricing.mrp === "" ||
      productData.pricing.costPrice === "" ||
      productData.description.some((hd) => !hd.heading || !hd.description)
    ) {
      toast.warn("Please fill in all the required fields", { autoClose: 3000 });
      return;
    } else if (!imagePaths.length) {
      toast.warn("Kindly upload atleast one image of the product");
      return;
    } else {
      try {
        const { data } = await axios.post("/api/product/add-new-product", {
          productData,
        });

        if (data.success) {
          toast.success(data.message, { autoClose: 3000 });
        } else {
          toast.error(data.message, { autoClose: 3000 });
        }

        setProductData({
          productName: "",
          storeToken: Cookies.get("store_token"),
          category: "",
          pricing: {
            mrp: "",
            costPrice: "",
          },
          description: [{ heading: "", description: "" }],
          tags: [],
        });

        setImagePaths([]);
        setFile(null);
      } catch (error) {
        toast.error(error.message, { autoClose: 3000 });
      }
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePricingChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      pricing: {
        ...prevData.pricing,
        [name]: value,
      },
    }));
  };

  const onFileSubmit = async (e) => {
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
      } else {
        const filePath = json.location;
        toast.success("Image uploaded successfully");

        setImagePaths((prevImagePaths) => {
          return [...prevImagePaths, filePath];
        });

        // Update productData with the image names
        setProductData((prevData) => ({
          ...prevData,
          imagePaths: [...prevData.imagePaths, filePath],
        }));

        setFile(null);
      }
    } catch (e) {
      console.error(e);
      toast.error("Error uploading image");
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="p-2">
      <form onSubmit={handleSubmit} className="text-sm">
        <div className="mb-4">
          <label htmlFor="productName" className="block font-medium">
            Product Name:
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            className="w-full px-2 py-1 border border-gray-300 rounded-full"
            value={productData.productName}
            onChange={handleFieldChange}
          />
        </div>

        <div className="flex justify-between">
          <div className="mb-4 w-full">
            <label htmlFor="category" className="block font-medium">
              Category:
            </label>
            <select
              id="category"
              name="category"
              className="w-full px-2 py-1 border border-gray-300 rounded-full text-gray-600"
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

          <div className="mb-4 w-full">
            <label htmlFor="subcategory" className="block font-medium">
              Sub-Category:
            </label>
            <select
              id="subcategory"
              name="subcategory"
              className="w-full px-2 py-1 border border-gray-300 rounded-full text-gray-600 ml-1"
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
        <div className="flex justify-between">
          <div className="mb-4 mx-1">
            <label htmlFor="mrp" className="block font-medium">
              MRP:
            </label>
            <input
              type="text"
              id="mrp"
              name="mrp"
              className="w-full px-2 py-1 border border-gray-300 rounded-full"
              value={productData.pricing.mrp}
              onChange={handlePricingChange}
            />
          </div>
          <div className="mb-4 mx-1">
            <label htmlFor="costPrice" className="block font-medium">
              Cost Price:
            </label>
            <input
              type="text"
              id="costPrice"
              name="costPrice"
              className="w-full px-2 py-1 border border-gray-300 rounded-full"
              value={productData.pricing.costPrice}
              onChange={handlePricingChange}
            />
          </div>
        </div>

        <label htmlFor="file" className="block font-medium">
          Upload Product Images (Upto 10)
        </label>

        <div className="p-2 border rounded-xl mb-4">
          <input
            type="file"
            name="file"
            onChange={(e) => setFile(e.target.files?.[0])}
          />
          <button
            className="w-fit my-2 bg-blue-500 px-4 py-2 text-white rounded-lg"
            onClick={onFileSubmit}
            disabled={!file || uploadLoading || imagePaths.length >= 10}
          >
            {uploadLoading ? "Uploading..." : "Upload"}
          </button>

          <div>
            {imagePaths.length > 0 && (
              <span className="text-yellow-400 text-lg">
                You can add {parseInt(10 - imagePaths.length)} more images
              </span>
            )}
          </div>

          {/* Display the list of uploaded image filenames */}
          {imagePaths.length > 0 && (
            <div>
              <h2 className="mb-3">Uploaded Images:</h2>
              <ul className="flex flex-wrap gap-4">
                {imagePaths.map((imageName, index) => (
                  <img
                    className="w-14 aspect-square border border-gray-400 rounded-md p-2"
                    src={imageName}
                    key={index}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="mb-4">
            <label htmlFor="description" className="block font-medium">
              Add Product Descriptions:
            </label>
            {productData.description.map((hd, index) => (
              <div key={index} className="flex flex-col mb-2">
                <input
                  type="text"
                  name="heading"
                  placeholder="Heading"
                  className="px-2 py-1 border border-gray-300 rounded-md mr-2 my-2"
                  value={hd.heading}
                  onChange={(e) => handleHeadingDescriptionChange(index, e)}
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  rows="4"
                  className="flex-grow px-2 py-1 border border-gray-300 rounded-md"
                  value={hd.description}
                  onChange={(e) => handleHeadingDescriptionChange(index, e)}
                />
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-500 px-4 py-2 text-white rounded-lg"
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
            </button>
          </div>
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
              className="w-full px-2 py-1 border border-gray-300 rounded-full"
              value={productData.tags.join(", ")}
              onChange={handleTagsChange}
              placeholder="Enter tags (comma separated)"
            />
          </div>
          {productData.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap">
              {productData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full mr-2 mb-2 flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="bg-[#f17e13] text-white px-4 py-1 rounded-full hover:opacity-75"
          >
            Add Stock
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewStock;

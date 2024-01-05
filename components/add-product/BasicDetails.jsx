import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BasicDetails = ({ productData, setProductData }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [subcategories, setSubcategories] = useState([]);

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
          console.error(
            `Category "${productData.category}" not found in categoriesData.`
          );
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

  return (
    <div className="min-h-[73vh]">
      <div className="mb-4 flex flex-col gap-1">
        <label htmlFor="productName" className="block font-medium">
          Product Name:
        </label>
        <input
          type="text"
          id="productName"
          name="productName"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={productData.productName}
          onChange={handleFieldChange}
        />
      </div>

      <div className="flex justify-between gap-2">
        <div className="mb-4 w-full flex flex-col gap-1">
          <label htmlFor="category" className="block font-medium">
            Category:
          </label>
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

        <div className="mb-4 w-full flex flex-col gap-1">
          <label htmlFor="subcategory" className="block font-medium">
            Sub-Category:
          </label>
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
    </div>
  );
};

export default BasicDetails;

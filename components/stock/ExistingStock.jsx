import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { toast } from "react-toastify";

const ExistingStock = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSearch = async () => {
    try {
      const { data } = await axios.post("/api/product/fetch-search-products", {
        searchQuery: searchTerm,
      });

      setSearchResults(data.products);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleProductSelection = (product) => {
    setSelectedProduct(product);
    setProductData({
      productName: product.productName,
      storeToken: Cookies.get("store_token"),
      category: product.category,
      subcategory: product.subcategory,
      imagePaths: product.imagePaths,
      pricing: {
        mrp: product.pricing.mrp,
        costPrice: product.pricing.costPrice,
      },
      description: product.description,
    });
  };

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
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(productData);

    try {
      const response = await axios.post("/api/product/add-new-product", {
        productData,
      });
      console.log(response.data);

      if (response.data.success) {
        toast.success(response.data.message, { autoClose: 3000 });
      } else {
        toast.error(response.data.message, { autoClose: 3000 });
      }

      setProductData({
        productName: "",
        storeToken: Cookies.get("store_token"),
        category: "",
        pricing: {
          mrp: "",
          costPrice: "",
        },
        description: "",
      });
    } catch (e) {
      toast.error(e.message, { autoClose: 3000 });
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

  return (
    <div className="p-2">
      {/* Search Bar */}
      <div className="mb-4">
        <label htmlFor="search" className="block font-medium">
          Search for a Product:
        </label>
        <div className="flex">
          <input
            type="text"
            id="search"
            name="search"
            className="w-full px-2 border border-gray-300 rounded-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="button"
            className="ml-2 bg-[#f17e13] px-4 py-2 text-white rounded-lg"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/* Display search results */}
        {!selectedProduct && searchResults.length > 0 && (
          <div className="mt-2">
            <h2 className="mb-3">Search Results:</h2>
            <ul className="flex flex-wrap justify-between">
              {searchResults.map((product) => (
                <li
                  key={product._id}
                  onClick={() => handleProductSelection(product)}
                  className="cursor-pointer text-gray-700 w-44 border rounded-lg m-3 flex flex-col items-center p-2"
                >
                  <img
                    className="w-fit"
                    src={product.imagePaths[0]}
                    alt="Product"
                  />
                  <span>{product.productName.slice(0, 50)}...</span>
                  {/* <span className="text-[#f17e13] border border-[#f17e13] rounded-full px-4 text-sm font-bold my-2">Edit</span> */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {
        <form
          onSubmit={handleSubmit}
          className={`text-sm ${!selectedProduct ? "hidden" : "block"}`}
        >
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

          {productData.description && productData.description.map((desc) => {
            return (
              <div className="mb-4" key={desc.heading}>
                <label htmlFor="description" className="block font-medium">
                  {desc.heading}
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  value={desc.description}
                  onChange={handleFieldChange}
                />
              </div>
            );
          })}

          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="bg-[#f17e13] text-white px-4 py-1 rounded-full hover:opacity-75"
            >
              Add Stock
            </button>
            {/* <button
              className="bg-white border border-[#f17e13] mx-2 text-[#f17e13] px-4 py-1 rounded-full hover:opacity-75"
              onClick={() => {
                setSelectedProduct(null);
              }}
            >
              Clear
            </button> */}
          </div>
        </form>
      }
    </div>
  );
};

export default ExistingStock;
